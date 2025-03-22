const express = require('express');

const router = express.Router();



const {UserSignin, UserSignup,registerHospital,loginHospital} = require('../Controllers/authController')

//user routes
router.post('/user-signup',UserSignup);
router.post('/user-signin',UserSignin);


// Hospital auth routes

router.post('/hospital-signup',registerHospital)

router.post('/hospital-signin',loginHospital)

//Ambulance auth routes

router.post('/ambulance-signup',)

router.post('/ambulance-signin',)

module.exports = router;