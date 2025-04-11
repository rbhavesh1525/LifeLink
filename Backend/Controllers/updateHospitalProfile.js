const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')
const Hospital  =require('../Models/HospitalAuthModel');



const getHospitalProfile = async (req, res) => {
    try {
        const { hospitalId } = req.params; 

        // console.log("Hospital ID received:", hospitalId);

       
        if (!hospitalId || !mongoose.Types.ObjectId.isValid(hospitalId.toString())) {
            return res.status(400).json({ message: "Invalid Hospital ID format" });
        }

        
        const hospital = await Hospital.findById(hospitalId);

        if (!hospital) {
            return res.status(404).json({ message: "Hospital not found" });
        }

        res.status(200).json(hospital);
    } catch (error) {
        console.error("Error fetching hospital info:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



const updateHospitalProfile=async(req,res)=>{
        try{

            const {hospitalId} = req.params;
            console.log("received hospital id ",hospitalId);

            const hospital = await Hospital.findByIdAndUpdate(hospitalId);

            if(!hospital){
                return res.status(404).json({message:"Hospital Not found"});
            }
    res.status(200).json(hospital);
        }
        catch(error){
                return res.status(500).json({message:"server error",error});
        }
}

module.exports = { getHospitalProfile,updateHospitalProfile };