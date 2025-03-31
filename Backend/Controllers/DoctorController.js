const Doctor = require('../Models/DoctorAvailibilityModel');


const fetchDoctors =async(req,res)=>{
try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
} catch (error) {
    res.status(500).json({message:"server error while fetching doctors", error:error.message})
}
}


const AddDoctor = async(req,res)=>{
const {name,specialization,status="AVAILABLE",note="-"} = req.body;

if(!name || !specialization){
    return res.status(400).json({message:"Please provide name and specialization"});
}

try {
    const newDoctor = new Doctor({name,specialization,status,note});
    const saveDoctor = await newDoctor.save();
    res.status(201).json(saveDoctor);
} catch (error) {
    res.status(500).json({message:"error adding doctor",error});
    console.error(error);
}
}




const UpdateDoctorStatus =async(req,res)=>{

    const {id} = req.params;
    const {status} = req.body;

    if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
    
      try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, { status }, { new: true });
    
        if (!updatedDoctor) {
          return res.status(404).json({ message: "Doctor not found" });
        }
    
        res.status(200).json({ message: "Status updated successfully", doctor: updatedDoctor });
      } catch (error) {
        res.status(500).json({ message: "Error updating status", error });
      }

}


const UpdateDoctorNote=async(req,res)=>{
    const { id } = req.params;
    const { note } = req.body;
  
    if (note === undefined) {
      return res.status(400).json({ message: "Note is required" });
    }
  
    try {
      const updatedDoctor = await Doctor.findByIdAndUpdate(id, { note }, { new: true });
  
      if (!updatedDoctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
  
      res.status(200).json({ message: "Note updated successfully", doctor: updatedDoctor });
    } catch (error) {
      res.status(500).json({ message: "Error updating note", error });
    }
}

module.exports={fetchDoctors,AddDoctor,UpdateDoctorNote,UpdateDoctorStatus};