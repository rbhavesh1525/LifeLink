const express = require("express")
const PatientTransfer = require("../Models/PatientTransfer")
const { io, getReceiverSocketId } = require("../utils/socket")
const Hospital = require("../Models/HospitalAuthModel")

const startTransfer = async(req,res) => {
    try {
        const {name, age, condition, diagnosis, ReasonForTransfer} = req.body
        const sourceHospital = req.user.id
        const destinationHospital = req.params.destinationHospitalId

        if(!name || !age || !condition || !diagnosis || !ReasonForTransfer){
            return res.status(400).json({message: "All fields are required"})
        }

        // Get source hospital name for notification
        const sourceHospitalData = await Hospital.findById(sourceHospital);
        const sourceHospitalName = sourceHospitalData ? sourceHospitalData.hospitalName : 'Unknown Hospital';

        const newTransfer = new PatientTransfer({
            name,
            age,
            condition,
            diagnosis,
            ReasonForTransfer,
            sourceHospital,
            destinationHospital
        })
        await newTransfer.save()

        // Send real-time notification to destination hospital
        const receiverSocketId = getReceiverSocketId(destinationHospital);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newTransfer", {
                ...newTransfer._doc,
                sourceHospitalName
            });
        }

        res.status(201).json({
            message : "Transfer initiated successfully",
            transfer: newTransfer
        })
    } catch (error) {
        console.error('Transfer Error',error)
        res.status(500).json({message:'Server error',error})
    }
}

// Get pending transfers for a hospital
const getPendingTransfers = async (req, res) => {
    try {
        const hospitalId = req.user.id;
        
        // Find transfers where this hospital is the destination
        const pendingTransfers = await PatientTransfer.find({ 
            destinationHospital: hospitalId 
        })
        .populate('sourceHospital', 'hospitalName email phone')
        .sort({ createdAt: -1 });
        
        res.status(200).json(pendingTransfers);
    } catch (error) {
        console.error('Error getting pending transfers:', error);
        res.status(500).json({ message: 'Server error', error });
    }
}

// Get outgoing transfers for a hospital
const getOutgoingTransfers = async (req, res) => {
    try {
        const hospitalId = req.user.id;
        
        // Find transfers where this hospital is the source
        const outgoingTransfers = await PatientTransfer.find({ 
            sourceHospital: hospitalId 
        })
        .populate('destinationHospital', 'hospitalName email phone')
        .sort({ createdAt: -1 });
        
        res.status(200).json(outgoingTransfers);
    } catch (error) {
        console.error('Error getting outgoing transfers:', error);
        res.status(500).json({ message: 'Server error', error });
    }
}

// Update transfer status
const updateTransferStatus = async (req, res) => {
    try {
        const { transferId } = req.params;
        const { status } = req.body;
        
        console.log(`Updating transfer ${transferId} to status: ${status}`);
        
        // Validate status
        if (!['accepted', 'rejected', 'completed'].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Must be 'accepted', 'rejected', or 'completed'" });
        }
        
        // First check if the transfer exists
        const existingTransfer = await PatientTransfer.findById(transferId);
        if (!existingTransfer) {
            console.log(`Transfer with ID ${transferId} not found`);
            return res.status(404).json({ message: "Transfer not found" });
        }
        
        console.log("Found existing transfer:", existingTransfer);
        
        // Update the transfer
        const transfer = await PatientTransfer.findByIdAndUpdate(
            transferId,
            { status },
            { new: true }
        ).populate('sourceHospital destinationHospital', 'hospitalName email');
        
        console.log("Updated transfer:", transfer);
        
        if (!transfer) {
            return res.status(404).json({ message: "Transfer not found" });
        }
        
        // Send notification to the other hospital
        const notifyHospitalId = req.user.id === transfer.sourceHospital._id.toString() 
            ? transfer.destinationHospital._id 
            : transfer.sourceHospital._id;
            
        const receiverSocketId = getReceiverSocketId(notifyHospitalId);
        console.log(`Notifying hospital ${notifyHospitalId}, socket ID: ${receiverSocketId}`);
        
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("transferStatusUpdated", {
                transferId,
                status,
                updatedBy: req.user.id,
                hospitalName: req.user.hospitalName
            });
        }
        
        res.status(200).json({ 
            message: `Transfer status updated to ${status}`,
            transfer 
        });
    } catch (error) {
        console.error('Error updating transfer status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = {startTransfer, getPendingTransfers, getOutgoingTransfers, updateTransferStatus}


