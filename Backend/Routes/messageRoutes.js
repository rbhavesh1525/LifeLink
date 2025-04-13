const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../Controllers/messageController');
const authmiddleware = require("../Middleware/authmiddleware");

// Get messages between two hospitals
router.get('/:id', authmiddleware, getMessages);

// Send message to another hospital
router.post('/:id', authmiddleware, sendMessage);

module.exports = router; 