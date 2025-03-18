const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Hospital } = require('../Models/Hospital');
const { PatientTransfer } = require('../Models/PatientTransfer')
const { Doctor } = require('../Models/Doctor')
const { ApiError } = require('../utils/ApiError')

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const signupHospital = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            address,
            contactNumber,
            totalBeds,
            availableBeds,
            icuBeds,
            emergencyBeds,
            specialties,
            facilities,
            isActive
        } = req.body;

        if (
            [name, email, password, address, contactNumber, totalBeds, availableBeds, icuBeds].some((field) => field?.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required");
        }
        const existingHospital = await Hospital.findOne({ email });
        if (existingHospital) {
            throw new ApiError(400, "Email Already Exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newHospital = new Hospital({
            name,
            email,
            password: hashedPassword,
            address,
            contactNumber,
            totalBeds,
            availableBeds,
            icuBeds,
            emergencyBeds,
            specialties,
            facilities,
            isActive
        });

        await newHospital.save();

        res.status(201).json({ message: 'Signup Successful! Please log in.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error signing up', error: error.message });
    }
};


const signinHospital = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new ApiError(400, "Email and Password is required")

        }
        const hospital = await Hospital.findOne({ email });
        if (!hospital) {
            throw new ApiError(404, "Hospital doesn't exists");
        }

        const isMatch = await bcrypt.compare(password, hospital.password);
        if (!isMatch) {
            throw new ApiError(401, "Invalid Password");
        }

        const token = jwt.sign({ id: hospital._id, role: 'Hospital' }, JWT_SECRET_KEY, {
            expiresIn: '7d',
        });

        res.status(200).json({ message: 'Signin Successful', token, hospital });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error signing in', error: error.message });
    }
};

const getHospitals = async (req, res) => {
    try {
        // Optionally filter only active hospitals
        const hospitals = await Hospital.find({ isActive: true }).select('hospitalName address availableBeds icuBeds emergencyBeds');

        res.status(200).json(hospitals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching hospitals', error: error.message });
    }
};


const updateHospital = async (req, res) => {
    try {
        const { id } = req.params; // Get hospital ID from URL params
        const { name, email, password, address, contactNumber, specialties, facilities } = req.body;

        const hospital = await Hospital.findById(id);
        if (!hospital) {
            throw new ApiError(404, "Hospital not found");
        }

        if (hospitalName) hospital.name = name;
        if (email) hospital.email = email;
        if (address) hospital.address = address;
        if (contactNumber) hospital.contactNumber = contactNumber;
        if (specialties) hospital.specialties = specialties;
        if (facilities) hospital.facilities = facilities;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            hospital.password = hashedPassword;
        }

        await hospital.save();

        res.status(200).json({ message: 'Hospital profile updated successfully', hospital });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating hospital', error: error.message });
    }
};

const updateBedStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { totalBeds, availableBeds, icuBeds, emergencyBeds } = req.body;

        const hospital = await Hospital.findById(id);
        if (!hospital) {
            throw new ApiError(404, "Hospital not found")
        }

        if (totalBeds !== undefined) hospital.totalBeds = totalBeds;
        if (availableBeds !== undefined) hospital.availableBeds = availableBeds;
        if (icuBeds !== undefined) hospital.icuBeds = icuBeds;
        if (emergencyBeds !== undefined) hospital.emergencyBeds = emergencyBeds;

        await hospital.save();

        res.status(200).json({ message: 'Bed status updated successfully', hospital });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating bed status', error: error.message });
    }
};

const transferPatient = async (req, res) => {
    try {
        const {
            patientName,
            age,
            gender,
            currentCondition,
            diagnosis,
            reasonForTransfer,
            sourceHospitalId,
            destinationHospitalId,
        } = req.body;

        // ✅ Step 1: Check if source and destination hospitals exist
        const sourceHospital = await Hospital.findById(sourceHospitalId);
        const destinationHospital = await Hospital.findById(destinationHospitalId);

        if (!sourceHospital || !destinationHospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        // ✅ Step 2: Check if destination hospital has available beds
        if (destinationHospital.availableBeds <= 0) {
            return res.status(400).json({ message: 'No available beds at the destination hospital' });
        }

        // ✅ Step 3: Create transfer record
        const transfer = new PatientTransfer({
            patientName,
            age,
            gender,
            currentCondition,
            diagnosis,
            reasonForTransfer,
            sourceHospital: sourceHospitalId,
            destinationHospital: destinationHospitalId,
            status: 'Pending',
        });

        await transfer.save();

        // ✅ Step 4: Update destination hospital's available beds
        // destinationHospital.availableBeds -= 1;
        await destinationHospital.save();

        res.status(201).json({
            message: 'Transfer request sent successfully',
            transfer,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating transfer request', error: error.message });
    }
};
const updateTransferStatus = async (req, res) => {
    try {
        const { transferId, status } = req.body;

        if (!['Accepted', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const transfer = await PatientTransfer.findById(transferId);
        if (!transfer) {
            return res.status(404).json({ message: 'Transfer request not found' });
        }

        // ✅ Update the status
        transfer.status = status;
        await transfer.save();

        res.status(200).json({ message: `Transfer request ${status.toLowerCase()}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating transfer status', error: error.message });
    }
};
const getPendingTransfers = async (req, res) => {
    try {
        const { hospitalId } = req.params;

        const pendingTransfers = await PatientTransfer.find({
            toHospital: hospitalId,
            status: 'Pending'
        }).populate('fromHospital', 'hospitalName address');

        res.status(200).json(pendingTransfers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching pending transfers', error: error.message });
    }
};
const addDoctor = async (req, res) => {
    try {
        const hospitalId = req.user.id; // Extract hospital ID from JWT token

        const {
            name,
            email,
            specialization,
            department,
            qualifications,
            shift,
            experience,
            contactNumber,
            schedule
        } = req.body;

        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ message: 'Doctor with this email already exists' });
        }

        const newDoctor = new Doctor({
            name,
            email,
            specialization,
            department,
            qualifications,
            shift,
            experience,
            contactNumber,
            schedule,
            hospitalId
        });

        await newDoctor.save();

        res.status(201).json({
            message: 'Doctor added successfully',
            doctor: newDoctor
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding doctor', error: error.message });
    }
};
const updateDoctorStatus = async (req, res) => {
    try {
        const hospitalId = req.user.id; // Extract hospital ID from JWT token
        const { doctorId, available, shift } = req.body;

        const doctor = await Doctor.findOne({ _id: doctorId, hospitalId });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found or does not belong to this hospital' });
        }

        if (available !== undefined) doctor.available = available;
        if (shift) doctor.shift = shift;

        await doctor.save();

        res.status(200).json({
            message: 'Doctor status updated successfully',
            doctor
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating doctor status', error: error.message });
    }
};

module.exports = { updateDoctorStatus };





module.exports = {
    signupHospital,
    signinHospital,
    getHospitals,
    updateHospital,
    updateBedStatus,
    transferPatient,
    updateTransferStatus,
    getPendingTransfers,
    addDoctor
};
