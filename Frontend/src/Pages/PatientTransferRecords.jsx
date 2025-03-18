import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaHistory, FaCalendarAlt, FaClock, FaPlus } from "react-icons/fa";

function PatientTransferRecords() {
  const [transferrecorddata, setTransferRecordData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    patientName: "",
    hospital: "",
    date: "",
    time: "",
    status: "completed",
    notes: "",
  });

  useEffect(() => {
    fetchTransferRecords();
  }, []);

  const fetchTransferRecords = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/transfer-records");
      setTransferRecordData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
  };

  const handleSavePatient = async () => {
    try {
      await axios.post("http://localhost:5000/api/transfer-records", newPatient);
      setIsModalOpen(false); // Close modal after saving
      fetchTransferRecords(); // Refresh table data
    } catch (error) {
      console.error("Error saving patient:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 border border-gray-300 rounded-lg bg-white shadow-md">
      {/* Heading Section */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Transfer Records</h1>
        <p className="text-gray-600">View and manage patient transfer history</p>
      </div>

      {/* Transfer History Heading and Search Section */}
      <div className="flex justify-between items-center mb-4">
        {/* Transfer History Heading with Icon */}
        <div className="flex items-center space-x-2">
          <FaHistory className="text-gray-700 text-xl" />
          <h2 className="text-lg font-semibold text-gray-800">Transfer History</h2>
        </div>

        {/* Search and Add Patient Section */}
        <div className="flex items-center space-x-3">
          {/* Add Patient Button */}
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer mr-40 "
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus className="mr-2" /> Add Patient
          </button>

          {/* Search Input */}
          <div className="flex items-center border border-gray-300 rounded px-3 py-2 ml-4 mr-4">
            <input
              type="text"
              placeholder="Search a patient"
              className="w-full focus:outline-none"
            />
            <FaSearch className="text-gray-500 cursor-pointer hover:text-gray-700" />
          </div>

          {/* Filter Dropdown */}
          <select className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="inprogress">In Progress</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Transfer History Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border border-gray-200">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-300">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Patient Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Hospital
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <FaCalendarAlt className="inline-block mr-1 text-gray-500" /> Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <FaClock className="inline-block mr-1 text-gray-500" /> Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {transferrecorddata.length > 0 ? (
              transferrecorddata.map((record, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="px-6 py-4">{record.patientName}</td>
                  <td className="px-6 py-4">{record.hospital}</td>
                  <td className="px-6 py-4 flex items-center">
                    <FaCalendarAlt className="text-gray-500 mr-2" /> {record.date}
                  </td>
                  <td className="px-6 py-4 flex items-center">
                    <FaClock className="text-gray-500 mr-2" /> {record.time}
                  </td>
                  <td className="px-6 py-4 text-green-600 font-semibold">
                    {record.status.toUpperCase()}
                  </td>
                  <td className="px-6 py-4">{record.notes}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Patient Modal */}
      {isModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">
    <div className="bg-white p-8 rounded-lg shadow-xl h-[500px] w-[550px] relative">
      
      {/* Close Button */}
      <button 
        className="absolute top-4 right-7 text-gray-500 hover:text-red-500 text-xl cursor-pointer text-red-400"
        onClick={() => setIsModalOpen(false)}
      >
        X
      </button>

      <h2 className="text-2xl font-semibold mb-6 text-center">Add Patient</h2>

      {/* Input Fields with proper spacing */}
      <div className="flex flex-col gap-4 pb-3">
        <input className="w-full p-3 border rounded-md mb-2" name="patientName" placeholder="Patient Name" onChange={handleInputChange} />
        <input className="w-full p-3 border rounded-md mb-2" name="hospital" placeholder="Hospital" onChange={handleInputChange} />
        <input className="w-full p-3 border rounded-md mb-2" type="date" name="date" onChange={handleInputChange} />
        <input className="w-full p-3 border rounded-md mb-2" type="time" name="time" onChange={handleInputChange} />
        <textarea className="w-full p-3 border rounded-md mb-2" name="notes" placeholder="Notes" rows="3" onChange={handleInputChange}></textarea>
      </div>

      <button 
        className="mt-6 w-full bg-blue-500 text-white px-4 py-3 rounded-md transition-transform transform hover:scale-105 hover:bg-blue-600 cursor-pointer"
        onClick={handleSavePatient}
      >
        Save Patient
      </button>
    </div>
  </div>
)}


    </div>
  );
}

export default PatientTransferRecords;
