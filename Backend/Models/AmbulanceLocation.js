const mongoose = require('mongoose');


const AmbulanceLocationSchema = new mongoose.Schema({
    ambulanceId: {
        type: String,
        required: true,
        unique: true
      },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true
        }
      }


});

AmbulanceLocationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model("AmbulanceLocation",AmbulanceLocationSchema)