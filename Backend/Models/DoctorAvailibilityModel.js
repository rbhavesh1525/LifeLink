const mongoose = require('mongoose');


const DoctorSchema = new mongoose.Schema({

    name: String,

    specialization:String,

    status:{
        type:String,
        default:'AVAILABLE',
    },

    note:{
        type:String,
        default:"-",
    }

})