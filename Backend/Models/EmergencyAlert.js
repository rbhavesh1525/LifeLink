const mongoose = require('mongoose');

const emergencyAlertSchema = new mongoose.Schema({
    hospitalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['Bed Shortage', 'Staff Shortage', 'Equipment Issue', 'Natural Disaster', 'Mass Casualty', 'Other'],
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Active', 'In Progress', 'Resolved', 'Cancelled'],
        default: 'Active'
    },
    affectedDepartments: [{
        type: String,
        trim: true
    }],
    requiredResources: [{
        type: String,
        quantity: Number,
        unit: String
    }],
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    resolutionNotes: {
        type: String,
        trim: true
    },
    affectedPatients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }],
    estimatedResolutionTime: Date,
    actualResolutionTime: Date,
    notificationsSent: {
        type: Boolean,
        default: false
    },
    notificationRecipients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    }]
}, {
    timestamps: true
});

// Add indexes for faster queries
emergencyAlertSchema.index({ hospitalId: 1, status: 1 });
emergencyAlertSchema.index({ type: 1, priority: 1 });
emergencyAlertSchema.index({ createdAt: 1 });

const EmergencyAlert = mongoose.model('EmergencyAlert', emergencyAlertSchema);
module.exports = EmergencyAlert;
  