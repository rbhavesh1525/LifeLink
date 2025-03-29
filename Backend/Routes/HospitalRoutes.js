const express = require('express');
const router = express.Router();

const {getHospitalProfile, updateHospitalProfile} = require('../Controllers/updateHospitalProfile');




router.get('/get-hospital-info/:hospitalId',getHospitalProfile)


router.put('/update-hospital-profile/:hospitalId',updateHospitalProfile)


module.exports = router;
