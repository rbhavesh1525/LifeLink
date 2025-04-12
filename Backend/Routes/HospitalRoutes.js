const express = require('express');
const router = express.Router();

const {getHospitalProfile, updateHospitalProfile} = require('../Controllers/updateHospitalProfile');

const getNearbyHospitals = require('../Controllers/NearbyHospital')




router.get('/get-hospital-info/:hospitalId',getHospitalProfile)


router.put('/update-hospital-profile/:hospitalId',updateHospitalProfile)

router.get('/get-nearby-hospital/:userId',getNearbyHospitals)


module.exports = router;
