const express = require('express');
const router = express.Router();
const { startTransfer, getPendingTransfers, getOutgoingTransfers } = require('../Controllers/TransferController');
const authmiddleware = require("../Middleware/authmiddleware");

// Start a new transfer request
router.post('/start/:destinationHospitalId', authmiddleware, startTransfer);

// Get pending transfers (transfers where this hospital is the destination)
router.get('/pending', authmiddleware, getPendingTransfers);

// Get outgoing transfers (transfers sent by this hospital)
router.get('/outgoing', authmiddleware, getOutgoingTransfers);

module.exports = router; 