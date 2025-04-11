const express = require('express');
const router = express.Router();


const {AddDoctor,fetchDoctors,UpdateDoctorNote,UpdateDoctorStatus} = require('../Controllers/DoctorController');


router.post('/add-doctor',AddDoctor)
router.get('/fetch-doctors',fetchDoctors)
router.put('/update-doctor-Note/:id/note',UpdateDoctorNote)
router.put('/update-doctor-status/:id/status',UpdateDoctorStatus)


module.exports= router;