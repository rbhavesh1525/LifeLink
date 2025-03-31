import { useEffect, useState } from "react";
import axios from 'axios';

import { FaUserMd, FaTimesCircle, FaPlus } from "react-icons/fa";


const DoctorAvailability = () => {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({ name: "", specialization: "" });
  const [noteInput, setNoteInput] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);


  const handleOpenNotePopup = (doctor) => {
    setSelectedDoctor(doctor);
    setNoteInput(doctor.note);
    setIsPopupOpen(true);
  };

useEffect(()=>{
  axios.get('http://localhost:5000/api/fetch-doctors')
  .then(response=>setDoctors(response.data))
  .catch(error=>console.error("Error fetching doctors",error));
 
})

 

  const handleAddDoctor = async () => {
    if (newDoctor.name && newDoctor.specialization) {
      try {
        const response = await axios.post('http://localhost:5000/api/add-doctor', {
          ...newDoctor, 
          status: "AVAILABLE", 
          note: "-"
        });
  
        setDoctors((prevDoctors) => [...prevDoctors, response.data]);
  
        setNewDoctor((prev) => ({ ...prev, name: "", specialization: "" }));
      } catch (error) {
        console.error("Error adding doctor:", error);
      }
    }
  };
  
  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/update-doctor-status/${id}/status`, { status: newStatus });
  
      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor) =>
          doctor._id === id ? { ...doctor, status: newStatus } : doctor
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  
  const handleSaveNote = async () => {
    if (!selectedDoctor) return;
  
    try {
      await axios.put(`http://localhost:5000/api/update-doctor-note/${selectedDoctor._id}/note`, { note: noteInput });
  
      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor) =>
          doctor._id === selectedDoctor._id ? { ...doctor, note: noteInput } : doctor
        )
      );
  
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };


  return (
    <div className="p-6 max-w-7xl mx-auto  bg-white shadow-md rounded-lg border border-gray-300 mt-10 ">
      <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">Update Doctor Availability</h2>

      {/* Add Doctor Form */}
      <div className="flex justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Doctor Name"
          value={newDoctor.name}
          onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
          className="border p-2 rounded-lg"
        />
        <input
          type="text"
          placeholder="Specialization"
          value={newDoctor.specialization}
          onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
          className="border p-2 rounded-lg"
        />
        <button onClick={handleAddDoctor} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition flex items-center gap-2 cursor-pointer">
          <FaPlus /> Add Doctor
        </button>
      </div>

      {/* Doctors List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Specialization</th>
              <th className=" pr-14">Status</th>
              <th className="p-4 pr-52  ">Note</th>
              <th className="p-4 pr-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor._id} className="border-b hover:bg-gray-50">
                <td className="p-4">{doctor.name}</td>
                <td className="p-4">{doctor.specialization}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    doctor.status === "AVAILABLE"
                      ? "bg-green-100 text-green-700"
                      : doctor.status === "UNAVAILABLE"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {doctor.status}
                  </span>
                </td>
                <td className="p-4">{doctor.note}</td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleStatusChange(doctor._id, "AVAILABLE")}
                    className="p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition cursor-pointer"
                    title="Mark Available"
                  >
                    <FaUserMd />
                  </button>
                  <button
                    onClick={() => handleStatusChange(doctor._id, "UNAVAILABLE")}
                    className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition cursor-pointer"
                    title="Mark Unavailable"
                  >
                    <FaTimesCircle />
                  </button>
                  <button
                    onClick={() => handleOpenNotePopup(doctor)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition cursor-pointer"
                  >
                    Add Note
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-blur">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Add Note for {selectedDoctor.name}</h3>
            <textarea
              className="w-full p-2 border rounded-md"
              rows="3"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setIsPopupOpen(false)} className="px-4 py-2 bg-gray-300 rounded-lg cursor-pointer">Cancel</button>
              <button onClick={handleSaveNote} className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAvailability;
