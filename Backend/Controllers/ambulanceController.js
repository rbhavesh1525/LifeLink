const Ambulance = require('../Models/AmbulanceAuthModel');

const AmbulanceLocation = require('../Models/AmbulanceLocation')
const mongoose = require('mongoose')
const UserLocation = require('../Models/UserLocation');


const updateStatus = async(req,res)=>{
      const  {status} = req.body;
      const {id} = req.params;


      if(!["active","inactive"].includes(status)){
      return res.status(400).json({message:"Invalid status"})
      }

      try {
        const ambulance = await Ambulance.findOneAndUpdate(
           { _id:id},
            {status},
            {upsert:true,new:true}
        )

        if(!ambulance){
            return res.status(404).json({message:"Ambulance not found"});
        }

        res.status(200).json({message: 'Status updated successfully', status: ambulance.status })
      } catch (error) {
        res.status(500).json({ message: 'Error updating status' });
      }

}

// In ambulanceController.js

const updateAmbulanceLocation = async (req, res) => {
  const { latitude, longitude } = req.body;
  const { ambulanceId } = req.params;

  try {
    const updated = await AmbulanceLocation.findOneAndUpdate(
      { ambulanceId },
      {
        ambulanceId,
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      { upsert: true, new: true } // create if doesn't exist
    );

    res.status(200).json({ message: "Location updated successfully", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating location" });
  }
};




const FindNearbyAmbulance = async (req, res) => {
  try {
    const { userId } = req.params;

    // Step 1: Get user location
    const userLocation = await UserLocation.findOne({ userId });
    if (!userLocation) {
      return res.status(404).json({ message: "User location not found" });
    }

    const { latitude, longitude } = userLocation.location;

    // Step 2: Get all ambulance locations
    const ambulanceLocations = await AmbulanceLocation.find();

    // Step 3: Filter ambulances within 5km using Haversine formula
    const nearbyAmbulances = ambulanceLocations.filter(ambulance => {
      const [ambulanceLongitude, ambulanceLatitude] = ambulance.location.coordinates;
      const distance = haversine(latitude, longitude, ambulanceLatitude, ambulanceLongitude);
      return distance <= 5; // 5 km radius
    });

    // Step 4: Convert ambulanceId to ObjectId array
    const ambulanceIds = nearbyAmbulances.map(a => new mongoose.Types.ObjectId(a.ambulanceId));

    // Step 5: Fetch ambulance details using ambulanceId
    const ambulanceDetails = await Ambulance.find({ _id: { $in: ambulanceIds } });

    // Step 6: Merge data
    const result = nearbyAmbulances.map(ambulance => {
      const matched = ambulanceDetails.find(
        detail => detail._id.toString() === new mongoose.Types.ObjectId(ambulance.ambulanceId).toString()
      );
      return {
        ...ambulance.toObject(),
        details: matched || null,
      };
    });

    if (result.length === 0) {
      return res.status(404).json({ message: "No nearby ambulances found" });
    }

    res.status(200).json({ nearbyAmbulances: result });

  } catch (error) {
    console.error("Error finding nearby ambulances:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper: Haversine formula to calculate distance
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
module.exports = FindNearbyAmbulance;

module.exports = {updateStatus,updateAmbulanceLocation,FindNearbyAmbulance}