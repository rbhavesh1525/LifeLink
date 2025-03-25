const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital', // Referencing the Hospital model
        required: true
    },
    GeneralWardMale: {
        total: { type: Number, default: 0 },
        available: { type: Number, default: 0 }
    },
    GeneralWardFemale: {
        total: { type: Number, default: 0 },
        available: { type: Number, default: 0 }
    },
    SemiPrivateBeds: {
        total: { type: Number, default: 0 },
        available: { type: Number, default: 0 }
    },
    PrivateBeds: {
        total: { type: Number, default: 0 },
        available: { type: Number, default: 0 }
    },
    ICUBeds: {
        total: { type: Number, default: 0 },
        available: { type: Number, default: 0 }
    },
    CCUBeds: {
        total: { type: Number, default: 0 },
        available: { type: Number, default: 0 }
    },
    HDUBeds: {
        total: { type: Number, default: 0 },
        available: { type: Number, default: 0 }
    },
    NICUBeds: {
        total: { type: Number, default: 0 },
        available: { type: Number, default: 0 }
    },
    PICUBeds: {
        total: { type: Number, default: 0 },
        available: { type: Number, default: 0 }
    }
}, { timestamps: true });

const Bed = mongoose.model("Bed", bedSchema);
module.exports = Bed;
