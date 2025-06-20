const express = require('express');
const router = express.Router();
const transferController = require('../Controllers/TransferController');
const authmiddleware = require("../Middleware/authmiddleware");

// Start a new transfer request
router.post('/start/:destinationHospitalId', authmiddleware, transferController.startTransfer);

// Get pending transfers (transfers where this hospital is the destination)
router.get('/pending', authmiddleware, transferController.getPendingTransfers);

// Get outgoing transfers (transfers sent by this hospital)
router.get('/outgoing', authmiddleware, transferController.getOutgoingTransfers);

// Route to update transfer status
router.put('/update/:transferId', authmiddleware, transferController.updateTransferStatus);

module.exports = router; 