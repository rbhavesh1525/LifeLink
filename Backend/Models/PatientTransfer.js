const mongoose = require('mongoose');
const PatientTransferSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true,
    },
    age :{
        type: Number,
        required: true
    },
    condition :{
        type: String,
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    ReasonForTransfer: {
        type: String,
        required: true
    },
    sourceHospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Hospital',
        required: true
    },
    destinationHospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    }
}, {
    timestamps: true
})

const PatientTransfer = mongoose.model('PatientTransfer',PatientTransferSchema)
module.exports = PatientTransfer