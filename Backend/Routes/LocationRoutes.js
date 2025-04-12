const express = require("express");
const router = express.Router();

const { saveUserLocation } = require("../Controllers/SaveLocation");

router.post("/save-location", saveUserLocation);

module.exports = router;
