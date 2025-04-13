const express = require('express');

const router = express.Router();
const upload = require('../Middleware/upload');
const authmiddleware = require("../Middleware/authmiddleware")


const {UserSignin, UserSignup,registerHospital,loginHospital,registerAmbulance,loginAmbulance} = require('../Controllers/authController')
const { setBedDetails, getBedDetails } = require('../Controllers/bedController');
const {startTransfer} = require('../Controllers/TransferController')

//user routes
router.post('/user-signup',UserSignup);
router.post('/user-signin',UserSignin);


// Hospital auth routes

router.post('/hospital-signup',registerHospital)

router.post('/hospital-signin',loginHospital)

//Ambulance auth routes

router.post('/ambulance-signup',upload.single("driverLicense"),   registerAmbulance)

router.post('/ambulance-signin',loginAmbulance)

// Bed routes
router.post('/set-bed-details', setBedDetails);
router.get('/set-bed-details', getBedDetails);

//Transfer routes
router.post('/start/:destinationHospitalId',authmiddleware,startTransfer)

module.exports = router;