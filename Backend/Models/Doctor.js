const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    specialization: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true
    },
    qualifications: [{
        degree: String,
        institution: String,
        year: Number
    }],
    shift: {
        type: String,
        enum: ['Morning', 'Afternoon', 'Night', 'Flexible'],
        required: true
    },
    available: {
        type: Boolean,
        default: false
    },
    experience: {
        type: Number,
        min: 0
    },
    contactNumber: {
        type: String,
        required: true
    },
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    schedule: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        startTime: {
            type: String, // Can be stored as "09:00 AM"
            required: true
        },
        endTime: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

// ✅ Add indexes for faster queries
doctorSchema.index({ name: 1, specialization: 1 });
doctorSchema.index({ email: 1 }, { unique: true });
doctorSchema.index({ hospitalId: 1, department: 1 });

// ✅ Automatically set availability based on schedule
doctorSchema.pre('save', function (next) {
    this.available = this.schedule.length > 0;
    next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
