const mongoose = require('mongoose');

const patientTransferSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },
    currentCondition: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    reasonForTransfer: {
        type: String,
        required: true,
    },
    sourceHospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    destinationHospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const PatientTransfer = mongoose.model('PatientTransfer', patientTransferSchema);
module.exports = PatientTransfer;
