const Hospital = require("../Models/HospitalAuthModel");
const Doctor = require("../Models/DoctorAvailibilityModel");
const UserLocation = require("../Models/UserLocation");

// Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of earth in KM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const getNearbyHospitals = async (req, res) => {
  try {
    const  userId = req.params.userId;

    console.log("Received User ID:", userId);

    const userLoc = await UserLocation.findOne({ userId });
    if (!userLoc || !userLoc.location) {
      return res.status(404).json({ message: "User location not found" });
    }
    const { latitude, longitude } = userLoc.location;

    // Step 2: Get hospitals with valid lat/lng
    const hospitals = await Hospital.find({
      latitude: { $ne: null },
      longitude: { $ne: null },
    });

    let finalList = [];

    for (const hospital of hospitals) {
      // Step 3: Check if hospital has any available doctors
      const availableDoctor = await Doctor.findOne({ status: "AVAILABLE" });
      if (!availableDoctor) continue; // skip if no available doc

      // Step 4: Calculate distance
      const distance = getDistance(
        latitude,
        longitude,
        hospital.latitude,
        hospital.longitude
      );

      finalList.push({
        hospital,
        distance: parseFloat(distance.toFixed(2)), // for display
      });
    }

    // Step 5: Sort by distance
    finalList.sort((a, b) => a.distance - b.distance);

    res.status(200).json(finalList);
  } catch (err) {
    console.error("Error in getNearbyHospitals:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = getNearbyHospitals;
