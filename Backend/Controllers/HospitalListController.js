const Hospital = require('../Models/HospitalAuthModel');

// Get all hospitals except the current one
const getAllHospitals = async (req, res) => {
  try {
    console.log("getAllHospitals controller called");
    const currentHospitalId = req.user.id;
    console.log("Current hospital ID:", currentHospitalId);
    
    // Find all hospitals except the current one
    const hospitals = await Hospital.find({ 
      _id: { $ne: currentHospitalId } 
    }).select('hospitalName email contactNumber location specialities');
    
    console.log(`Found ${hospitals.length} hospitals`);
    res.status(200).json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all hospitals - no authentication required
const getPublicHospitals = async (req, res) => {
  try {
    console.log("getPublicHospitals controller called");
    
    // Find all hospitals
    const hospitals = await Hospital.find({}).select('hospitalName email contactNumber location specialities');
    
    console.log(`Found ${hospitals.length} hospitals for public endpoint`);
    res.status(200).json(hospitals);
  } catch (error) {
    console.error('Error fetching public hospitals:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllHospitals, getPublicHospitals }; 