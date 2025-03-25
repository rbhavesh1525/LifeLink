const express = require('express');
const bcrypt = require('bcryptjs')
const User = require('../Models/authModel')
const Hospital = require('../Models/HospitalAuthModel');
const Bed = require('../Models/BedStatusModel')
const Ambulance = require('../Models/AmbulanceAuthModel');
const upload = require('../Middleware/upload');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const HOSPITAL_SECRET_KEY = process.env.HOSPITAL_SECRET_KEY;


const setBedDetails = async (req, res) => {
    try {
        const { hospitalId, bedDetails } = req.body;

        let bedRecord = await Bed.findOne({ hospitalId });

        if (!bedRecord) {
            bedRecord = new Bed({ hospitalId, ...bedDetails });
        } else {
            // Directly update both total and available values from the request
            Object.keys(bedDetails).forEach((key) => {
                if (bedDetails[key] && typeof bedDetails[key] === 'object') {
                    if (bedRecord[key]) {
                        // If the field exists in bedRecord, update it
                        if (bedDetails[key].total !== undefined) {
                            bedRecord[key].total = bedDetails[key].total;
                        }
                        if (bedDetails[key].available !== undefined) {
                            bedRecord[key].available = bedDetails[key].available;
                        }
                    } else {
                        // If the field doesn't exist, create it
                        bedRecord[key] = {
                            total: bedDetails[key].total || 0,
                            available: bedDetails[key].available || 0
                        };
                    }
                }
            });
        }

        await bedRecord.save();

        res.status(200).json({ message: 'Bed details updated successfully', bedRecord });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating bed details', error: error.message });
    }
};

// Get bed details by hospital ID
const getBedDetails = async (req, res) => {
    try {
        const { hospitalId } = req.query;

        if (!hospitalId) {
            return res.status(400).json({ message: 'Hospital ID is required' });
        }

        const bedRecord = await Bed.findOne({ hospitalId });

        if (!bedRecord) {
            return res.status(404).json({ message: 'Bed details not found for this hospital' });
        }

        res.status(200).json({ bedRecord });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching bed details', error: error.message });
    }
};

module.exports = { setBedDetails, getBedDetails };