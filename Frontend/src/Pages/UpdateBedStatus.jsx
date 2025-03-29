import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBed, FaProcedures, FaHospital, FaDoorOpen, FaClinicMedical, FaPlusCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthStore from "../Store/authStore";
import { useNavigate } from "react-router-dom";


axios.defaults.baseURL = 'http://localhost:5000';

// Mapping between frontend bed types and backend model fields
const bedTypeMapping = {
  generalWardMale: "GeneralWardMale",
  generalWardFemale: "GeneralWardFemale",
  semiPrivateBeds: "SemiPrivateBeds",
  privateBeds: "PrivateBeds",
  icuBeds: "ICUBeds",
  ccuBeds: "CCUBeds",
  hduBeds: "HDUBeds",
  nicuBeds: "NICUBeds",
  picuBeds: "PICUBeds",
};

const bedIcons = {
  generalWardMale: <FaBed className="text-blue-500 text-2xl" />,
  generalWardFemale: <FaBed className="text-pink-500 text-2xl" />,
  semiPrivateBeds: <FaHospital className="text-purple-500 text-2xl" />,
  privateBeds: <FaDoorOpen className="text-yellow-500 text-2xl" />,
  icuBeds: <FaProcedures className="text-red-500 text-2xl" />,
  ccuBeds: <FaClinicMedical className="text-green-500 text-2xl" />,
  hduBeds: <FaClinicMedical className="text-orange-500 text-2xl" />,
  nicuBeds: <FaClinicMedical className="text-indigo-500 text-2xl" />,
  picuBeds: <FaClinicMedical className="text-gray-500 text-2xl" />,
};

function UpdateBedStatus() {
  const [bedsData, setBedsData] = useState({
    generalWardMale: { total: 0, available: 0 },
    generalWardFemale: { total: 0, available: 0 },
    semiPrivateBeds: { total: 0, available: 0 },
    privateBeds: { total: 0, available: 0 },
    icuBeds: { total: 0, available: 0 },
    ccuBeds: { total: 0, available: 0 },
    hduBeds: { total: 0, available: 0 },
    nicuBeds: { total: 0, available: 0 },
    picuBeds: { total: 0, available: 0 },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();


  useEffect(() => {
    if (!user?.id) {
      toast.error("Please login to access this page");
      navigate("/hospital-signin");
      return;
    }
  }, [user, navigate]);

 
  useEffect(() => {
    const fetchBedData = async () => {
      if (!user?.id) {
        return;
      }

      try {
        const response = await axios.get(`/api/auth/set-bed-details?hospitalId=${user.id}`);
        if (response.data && response.data.bedRecord) {
          // Convert backend model to frontend format
          const convertedData = {};
          Object.keys(bedTypeMapping).forEach(frontendKey => {
            const backendKey = bedTypeMapping[frontendKey];
            const bedData = response.data.bedRecord[backendKey] || { total: 0, available: 0 };
            convertedData[frontendKey] = bedData;
          });
          setBedsData(convertedData);
        }
      } catch (error) {
        console.error("Error fetching bed data:", error);
        toast.error("Error loading bed data. Please try again.");
      }
    };

    fetchBedData();
  }, [user]);

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

  const handleModalSave = () => {
    
    setBedsData((prevData) => ({
      ...prevData,
      [selectedBed.type]: selectedBed.value,
    }));
    setIsModalOpen(false);
  };

  const handleSaveToServer = async () => {
    if (!user?.id) {
      toast.error("Hospital ID not found. Please login again.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Convert frontend data to backend format
      const bedDetails = {};
      Object.keys(bedsData).forEach(frontendKey => {
        const backendKey = bedTypeMapping[frontendKey];
        bedDetails[backendKey] = bedsData[frontendKey];
      });

      const response = await axios.post("/api/auth/set-bed-details", {
        hospitalId: user.id,
        bedDetails
      });

      if (response.status === 200) {
        toast.success("Bed details updated successfully!");
      }
    } catch (error) {
      console.error("Error updating bed details:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Failed to update bed details. Please try again.");
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
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
            <h3 className="text-lg font-semibold mt-2">{bedType.replace(/([A-Z])/g, " $1").replace(/^[a-z]/, c => c.toUpperCase())}</h3>
            <p className="text-gray-600">Total: {bedsData[bedType].total} | Available: {bedsData[bedType].available}</p>
          </div>
        ))}
      </div>

      {/* Update Button */}
      <button
        onClick={handleSaveToServer}
        disabled={isLoading}
        className={`mt-6 block mx-auto ${isLoading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-700'} text-white px-6 py-2 rounded-lg cursor-pointer transition`}
      >
        {isLoading ? "Updating..." : "Update Bed Status"}
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4">
              Update {selectedBed?.type.replace(/([A-Z])/g, " $1").replace(/^[a-z]/, c => c.toUpperCase())}
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Beds</label>
              <input
                type="number"
                value={selectedBed.value.total}
                onChange={(e) => updateBedData("total", e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Total Beds"
                min="0"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Beds</label>
              <input
                type="number"
                value={selectedBed.value.available}
                onChange={(e) => updateBedData("available", e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Available Beds"
                min="0"
                max={selectedBed.value.total}
              />
              {Number(selectedBed.value.available) > Number(selectedBed.value.total) && (
                <p className="text-red-500 text-xs mt-1">Available beds cannot exceed total beds</p>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-600"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
                onClick={handleModalSave}
                disabled={Number(selectedBed.value.available) > Number(selectedBed.value.total)}
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
