const express = require('express');
const router = express.Router();


const {AddDoctor,fetchDoctors,UpdateDoctorNote,UpdateDoctorStatus} = require('../Controllers/DoctorController');


router.post('/api/add-doctor',AddDoctor)
router.get('/api/fetch-doctors',fetchDoctors)
router.put('/api/update-doctor-Note',UpdateDoctorNote)
router.put('/api/update-doctor-status',UpdateDoctorStatus)