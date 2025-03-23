const express = require('express');

const router = express.Router();
const upload = require('../Middleware/upload');


const {UserSignin, UserSignup,registerHospital,loginHospital,registerAmbulance,loginAmbulance} = require('../Controllers/authController')

//user routes
router.post('/user-signup',UserSignup);
router.post('/user-signin',UserSignin);


// Hospital auth routes

router.post('/hospital-signup',registerHospital)

router.post('/hospital-signin',loginHospital)

//Ambulance auth routes

router.post('/ambulance-signup',upload.single("driverLicense"),   registerAmbulance)

router.post('/ambulance-signin',loginAmbulance)

module.exports = router;