const mongoose = require('mongoose')
const hospitalSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    password:{
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,

    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    contactNumber: { 
        type: String, 
        required: true 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    totalBeds: { 
        type: Number, 
        required: true,
        min: 0 
    },
    availableBeds: { 
        type: Number, 
        required: true,
        min: 0 
    },
    icuBeds: { 
        type: Number, 
        required: true,
        min: 0 
    },
    emergencyBeds: { 
        type: Number, 
        required: true,
        min: 0 
    },
    specialties: [{
        type: String,
        trim: true
    }],
    facilities: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
}, {timestamps:true});

// Add index for faster queries
hospitalSchema.index({ name: 1, location: 1 });
hospitalSchema.index({ email: 1 }, { unique: true });

const Hospital = mongoose.model('Hospital',hospitalSchema);
module.exports = Hospital;
  