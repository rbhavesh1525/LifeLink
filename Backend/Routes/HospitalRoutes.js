const express = require('express');
const router = express.Router();

const {getHospitalProfile, updateHospitalProfile} = require('../Controllers/updateHospitalProfile');
const { getAllHospitals, getPublicHospitals } = require('../Controllers/HospitalListController');
const { getNearbyHospitals, checkHospitalAvailability } = require('../Controllers/NearbyHospital');
const authmiddleware = require('../Middleware/authmiddleware');



router.get('/get-hospital-info/:hospitalId',getHospitalProfile)


router.put('/update-hospital-profile/:hospitalId',updateHospitalProfile)

router.get('/get-nearby-hospital/:userId',getNearbyHospitals)

// New route to check bed and doctor availability
router.get('/check-availability/:hospitalId', checkHospitalAvailability)

// Route to get all hospitals for transfer requests (requires hospital authentication)
router.get('/hospitals', authmiddleware, getAllHospitals)

// Public route to get all hospitals (no authentication required)
router.get('/public-hospitals', getPublicHospitals)


module.exports = router;
