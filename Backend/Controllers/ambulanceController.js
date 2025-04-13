const Ambulance = require('../Models/AmbulanceAvailability')

const AmbulanceLocation = require('../Models/AmbulanceLocation')

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
module.exports = {updateStatus,updateAmbulanceLocation}