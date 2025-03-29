const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 0
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    condition: {
        type: String,
        required: true,
        trim: true
    },
    medicalHistory: [{
        condition: String,
        diagnosis: String,
        treatment: String,
        date: Date
    }],
    allergies: [{
        type: String,
        trim: true
    }],
    currentMedications: [{
        name: String,
        dosage: String,
        frequency: String
    }],
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    assignedDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    isInICU: {
        type: Boolean,
        default: false
    },
    bedNumber: {
        type: String,
        trim: true
    },
    admissionDate: {
        type: Date,
        default: Date.now
    },
    emergencyContact: {
        name: String,
        phone: String,
        relationship: String
    },
    insurance: {
        provider: String,
        policyNumber: String,
        validUntil: Date
    },
    status: {
        type: String,
        enum: ['Admitted', 'Discharged', 'Transferred', 'Critical'],
        default: 'Admitted'
    }
}, {
    timestamps: true
});

// Add indexes for faster queries
patientSchema.index({ name: 1, hospitalId: 1 });
patientSchema.index({ assignedDoctor: 1, status: 1 });
patientSchema.index({ admissionDate: 1 });

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
    