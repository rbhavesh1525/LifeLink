import React, { useState } from "react";
import { FaBed, FaProcedures, FaHospital, FaDoorOpen, FaClinicMedical, FaPlusCircle } from "react-icons/fa";

const bedIcons = {
  generalBeds: <FaBed className="text-blue-500 text-2xl" />, 
  icuBeds: <FaProcedures className="text-red-500 text-2xl" />, 
  operationTheater: <FaHospital className="text-green-500 text-2xl" />, 
  totalBeds: <FaPlusCircle className="text-purple-500 text-2xl" />, 
  availableRooms: <FaDoorOpen className="text-yellow-500 text-2xl" />, 
  other: <FaClinicMedical className="text-gray-500 text-2xl" />, 
};

function UpdateBedStatus() {
  const [bedsData, setBedsData] = useState({
    generalBeds: { total: 0, available: 0 },
    icuBeds: { total: 0, available: 0 },
    operationTheater: { total: 0, available: 0 },
    totalBeds: { total: 0, available: 0 },
    availableRooms: { total: 0, available: 0 },
    other: { total: 0, available: 0 },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);

  const handleOpenModal = (bedType) => {
    setSelectedBed({ type: bedType, value: { ...bedsData[bedType] } });
    setIsModalOpen(true);
  };

  const updateBedData = (field, value) => {
    setSelectedBed((prev) => ({
      ...prev,
      value: { ...prev.value, [field]: Number(value) },
    }));
  };

  const handleSave = () => {
    setBedsData((prevData) => ({
      ...prevData,
      [selectedBed.type]: selectedBed.value,
    }));
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-2">Hospital Bed Management</h2>
      <p className="text-gray-600 text-center mb-6">Manage and update bed availability in real-time.</p>

      {/* Rectangle Boxes */}
      <div className="grid grid-cols-3 gap-4">
        {Object.keys(bedsData).map((bedType, index) => (
          <div
            key={index}
            className="p-6 bg-white border border-gray-300 rounded-lg cursor-pointer shadow-sm hover:shadow-lg hover:bg-gray-100 transition flex flex-col items-center"
            onClick={() => handleOpenModal(bedType)}
          >
            {bedIcons[bedType]}
            <h3 className="text-lg font-semibold mt-2">{bedType.replace(/([A-Z])/g, " $1")}</h3>
            <p className="text-gray-600">Total: {bedsData[bedType].total} | Available: {bedsData[bedType].available}</p>
          </div>
        ))}
      </div>

      {/* Update Button */}
      <button
        onClick={handleSave}
        className="mt-6 block mx-auto bg-green-500 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition"
      >
        Update Bed Status
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">Update {selectedBed?.type.replace(/([A-Z])/g, " $1")}</h3>

            <input
              type="number"
              value={selectedBed.value.total}
              onChange={(e) => updateBedData("total", e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Total Beds"
            />

            <input
              type="number"
              value={selectedBed.value.available}
              onChange={(e) => updateBedData("available", e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Available Beds"
            />

            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-600"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateBedStatus;
