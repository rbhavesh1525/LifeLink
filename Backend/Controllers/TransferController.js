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

module.exports = {startTransfer, getPendingTransfers, getOutgoingTransfers}


