const UserLocation = require('../Models/UserLocation');

const saveUserLocation = async (req, res) => {
  const { userid, latitude, longitude } = req.body;

  if (!userid || !latitude || !longitude) {
    return res.status(400).json({ message: "userid, latitude, and longitude are required" });
  }

  try {
    const updatedLocation = await UserLocation.findOneAndUpdate(
      { userId: userid }, 
      {
        $set: {
          location: { latitude, longitude },
        },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Location updated successfully",
      location: updatedLocation.location,
    });

  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { saveUserLocation };
