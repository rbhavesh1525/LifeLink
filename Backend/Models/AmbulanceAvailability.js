const mongoose = require('mongoose')

const AmbulanceSchema  = new mongoose.Schema({


    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive'
    }
});


const Ambulance = mongoose.model('Ambulance-status',AmbulanceSchema);

module.exports = Ambulance