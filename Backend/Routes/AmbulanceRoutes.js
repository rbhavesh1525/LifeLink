const express = require('express');

const router = express.Router();

const {updateStatus,updateAmbulanceLocation} = require('../Controllers/ambulanceController');

router.post('/update-status/:id', updateStatus);

router.post('/update-location/:ambulanceId',updateAmbulanceLocation)

module.exports = router;