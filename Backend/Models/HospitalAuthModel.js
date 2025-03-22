const mongoose = require("mongoose");

const HospitalSchema = new mongoose.Schema({
    hospitalName: 
    { type: String, 
        required: true 
    },
    hospitalType: { type: String, required: true },
    hospitalRegistrationNumber: { type: String, required: true, unique: true },
    hospitalDescription: { type: String, required: true },
    hospitalAddress: { type: String, required: true },
    hospitalPhone: { type: String, required: true },
    hospitalEmail: { type: String, required: true, unique: true },
    hospitalWebsite: { type: String },
    hospitalPassword: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Hospital", HospitalSchema);
