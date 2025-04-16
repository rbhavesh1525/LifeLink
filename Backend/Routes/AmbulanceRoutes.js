const express = require('express');

const router = express.Router();

const {updateStatus,updateAmbulanceLocation,FindNearbyAmbulance} = require('../Controllers/ambulanceController');

router.post('/update-status/:id', updateStatus);

router.post('/update-location/:ambulanceId',updateAmbulanceLocation);

router.get("/nearby-ambulances/:userId", FindNearbyAmbulance);

module.exports = router;