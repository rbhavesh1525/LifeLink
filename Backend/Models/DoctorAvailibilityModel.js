const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    status: { type: String, enum: ["AVAILABLE", "UNAVAILABLE", "BUSY"], default: "AVAILABLE" },
    note: { type: String, default: "-" }
});

const Doctor = mongoose.model('Doctor', DoctorSchema);
module.exports = Doctor;
