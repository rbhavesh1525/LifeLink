import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBed, FaUserMd, FaSpinner, FaTimes, FaHospital, FaAngleDown, FaAngleUp } from "react-icons/fa";

const NearbyHospitals = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    general: false,
    private: false,
    criticalCare: false,
    pediatric: false
  });

  const updateLocation = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          const userData = JSON.parse(localStorage.getItem("user"));
          const userid = userData?.id;

          try {
            const response = await axios.post(
              "http://localhost:5000/api/save-location",
              { latitude, longitude, userid }
            );

            setMessage("Location updated successfully!");
            console.log("Location saved to backend:", response.data);
          } catch (apiErr) {
            console.error("API Error while saving location:", apiErr);
            setError("Failed to save location");
          }

          setLoading(false);
        },
        (err) => {
          setError("Location access denied or not available");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported");
      setLoading(false);
    }
  };

  // Fetch nearby hospitals after location is available
  useEffect(() => {
    const fetchNearbyHospitals = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const userid = userData?.id;
        if (!userid) return;

        console.log(userid)

        setLoadingHospitals(true);
        const res = await axios.get(
          `http://localhost:5000/api/get-nearby-hospital/${userid}`
        );

        setHospitals(res.data);
        setLoadingHospitals(false);
      } catch (err) {
        console.error("Failed to fetch nearby hospitals:", err);
        setError("Error fetching nearby hospitals");
        setLoadingHospitals(false);
      }
    };

    if (location) {
      fetchNearbyHospitals();
    }
  }, [location]);

  // Check availability function
  const checkAvailability = async (hospitalId) => {
    try {
      setCheckingAvailability(true);
      const response = await axios.get(
        `http://localhost:5000/api/check-availability/${hospitalId}`
      );
      setAvailabilityData(response.data);
      setCheckingAvailability(false);
    } catch (error) {
      console.error("Error checking availability:", error);
      setError("Failed to check availability");
      setCheckingAvailability(false);
    }
  };

  // Handle check availability button click
  const handleCheckAvailability = (hospital) => {
    setSelectedHospital(hospital);
    checkAvailability(hospital._id);
  };

  // Close modal
  const closeModal = () => {
    setSelectedHospital(null);
    setAvailabilityData(null);
    setExpandedSections({
      general: false,
      private: false,
      criticalCare: false,
      pediatric: false
    });
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Filter hospitals based on search input
  const filteredHospitals = hospitals.filter(({ hospital }) =>
    hospital.hospitalName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={updateLocation}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Updating..." : "Update My Location"}
        </button>

        <input
          type="text"
          placeholder="Search hospitals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full max-w-md"
        />
      </div>

      {/* Message Section */}
      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {location && (
        <p className="text-gray-600 mb-4">
          Current Location: {location.latitude}, {location.longitude}
        </p>
      )}

      {/* Hospital List */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">
          Nearby Hospitals with Available Doctors
        </h2>

        {loadingHospitals ? (
          <p className="text-gray-500">Loading nearby hospitals...</p>
        ) : filteredHospitals.length === 0 ? (
          <p className="text-gray-500">No hospitals found.</p>
        ) : (
          <ul className="space-y-4">
            {filteredHospitals.map(({ hospital, distance }, idx) => (
              <li
                key={idx}
                className="border border-gray-300 p-4 rounded-md shadow-sm"
              >
                <h3 className="text-lg font-semibold">
                  🏥 {hospital.hospitalName}
                </h3>
                <p>📍 {hospital.hospitalAddress}</p>
                <p>📞 {hospital.hospitalPhone}</p>
                <p>📧 {hospital.hospitalEmail}</p>
                <p>🌐 {hospital.hospitalWebsite}</p>
                <p>📏 Distance: {distance} km</p>
                
                {/* Check Availability Button */}
                <button
                  onClick={() => handleCheckAvailability(hospital)}
                  className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center gap-2"
                >
                  <FaHospital />
                  Check Availability
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Availability Modal */}
      {selectedHospital && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedHospital.hospitalName} - Availability
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {checkingAvailability ? (
              <div className="flex justify-center items-center h-40">
                <FaSpinner className="animate-spin text-blue-600" size={48} />
                <span className="ml-2">Checking availability...</span>
              </div>
            ) : availabilityData ? (
              <div>
                {/* Bed Availability Overview Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                    <FaBed /> Bed Availability Summary
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="col-span-2 text-center bg-blue-100 p-2 rounded-md">
                        <p className="font-bold">Total Beds</p>
                        <p className="text-2xl font-bold">
                          {(availabilityData.beds?.detailedBeds?.general?.total?.available || 0) +
                           (availabilityData.beds?.detailedBeds?.private?.total?.available || 0) +
                           (availabilityData.beds?.detailedBeds?.criticalCare?.total?.available || 0) +
                           (availabilityData.beds?.detailedBeds?.pediatric?.total?.available || 0)}/
                          {(availabilityData.beds?.detailedBeds?.general?.total?.total || 0) +
                           (availabilityData.beds?.detailedBeds?.private?.total?.total || 0) +
                           (availabilityData.beds?.detailedBeds?.criticalCare?.total?.total || 0) +
                           (availabilityData.beds?.detailedBeds?.pediatric?.total?.total || 0)}
                        </p>
                      </div>
                    </div>

                    {/* Bed categories */}
                    <div className="space-y-4">
                      {/* General Beds Section */}
                      <div className="border border-blue-200 rounded-md overflow-hidden">
                        <div 
                          className="bg-blue-200 p-2 flex justify-between items-center cursor-pointer"
                          onClick={() => toggleSection('general')}
                        >
                          <h4 className="font-semibold">General Beds</h4>
                          <div className="flex items-center">
                            <span className="mr-2 font-bold">
                              {availabilityData.beds?.detailedBeds?.general?.total?.available || 0}/
                              {availabilityData.beds?.detailedBeds?.general?.total?.total || 0}
                            </span>
                            {expandedSections.general ? <FaAngleUp /> : <FaAngleDown />}
                          </div>
                        </div>
                        
                        {expandedSections.general && (
                          <div className="p-3 bg-white">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-2 bg-gray-50 rounded text-center">
                                <p className="text-sm font-semibold">Male Ward</p>
                                <p className="font-bold">
                                  {availabilityData.beds?.detailedBeds?.general?.male?.available || 0}/
                                  {availabilityData.beds?.detailedBeds?.general?.male?.total || 0}
                                </p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded text-center">
                                <p className="text-sm font-semibold">Female Ward</p>
                                <p className="font-bold">
                                  {availabilityData.beds?.detailedBeds?.general?.female?.available || 0}/
                                  {availabilityData.beds?.detailedBeds?.general?.female?.total || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Private Beds Section */}
                      <div className="border border-blue-200 rounded-md overflow-hidden">
                        <div 
                          className="bg-blue-200 p-2 flex justify-between items-center cursor-pointer"
                          onClick={() => toggleSection('private')}
                        >
                          <h4 className="font-semibold">Private Beds</h4>
                          <div className="flex items-center">
                            <span className="mr-2 font-bold">
                              {availabilityData.beds?.detailedBeds?.private?.total?.available || 0}/
                              {availabilityData.beds?.detailedBeds?.private?.total?.total || 0}
                            </span>
                            {expandedSections.private ? <FaAngleUp /> : <FaAngleDown />}
                          </div>
                        </div>
                        
                        {expandedSections.private && (
                          <div className="p-3 bg-white">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-2 bg-gray-50 rounded text-center">
                                <p className="text-sm font-semibold">Semi-Private</p>
                                <p className="font-bold">
                                  {availabilityData.beds?.detailedBeds?.private?.semi?.available || 0}/
                                  {availabilityData.beds?.detailedBeds?.private?.semi?.total || 0}
                                </p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded text-center">
                                <p className="text-sm font-semibold">Full Private</p>
                                <p className="font-bold">
                                  {availabilityData.beds?.detailedBeds?.private?.full?.available || 0}/
                                  {availabilityData.beds?.detailedBeds?.private?.full?.total || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Critical Care Beds Section */}
                      <div className="border border-blue-200 rounded-md overflow-hidden">
                        <div 
                          className="bg-blue-200 p-2 flex justify-between items-center cursor-pointer"
                          onClick={() => toggleSection('criticalCare')}
                        >
                          <h4 className="font-semibold">Critical Care</h4>
                          <div className="flex items-center">
                            <span className="mr-2 font-bold">
                              {availabilityData.beds?.detailedBeds?.criticalCare?.total?.available || 0}/
                              {availabilityData.beds?.detailedBeds?.criticalCare?.total?.total || 0}
                            </span>
                            {expandedSections.criticalCare ? <FaAngleUp /> : <FaAngleDown />}
                          </div>
                        </div>
                        
                        {expandedSections.criticalCare && (
                          <div className="p-3 bg-white">
                            <div className="grid grid-cols-3 gap-3">
                              <div className="p-2 bg-gray-50 rounded text-center">
                                <p className="text-sm font-semibold">ICU</p>
                                <p className="font-bold">
                                  {availabilityData.beds?.detailedBeds?.criticalCare?.icu?.available || 0}/
                                  {availabilityData.beds?.detailedBeds?.criticalCare?.icu?.total || 0}
                                </p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded text-center">
                                <p className="text-sm font-semibold">CCU</p>
                                <p className="font-bold">
                                  {availabilityData.beds?.detailedBeds?.criticalCare?.ccu?.available || 0}/
                                  {availabilityData.beds?.detailedBeds?.criticalCare?.ccu?.total || 0}
                                </p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded text-center">
                                <p className="text-sm font-semibold">HDU</p>
                                <p className="font-bold">
                                  {availabilityData.beds?.detailedBeds?.criticalCare?.hdu?.available || 0}/
                                  {availabilityData.beds?.detailedBeds?.criticalCare?.hdu?.total || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Pediatric Beds Section */}
                      <div className="border border-blue-200 rounded-md overflow-hidden">
                        <div 
                          className="bg-blue-200 p-2 flex justify-between items-center cursor-pointer"
                          onClick={() => toggleSection('pediatric')}
                        >
                          <h4 className="font-semibold">Pediatric</h4>
                          <div className="flex items-center">
                            <span className="mr-2 font-bold">
                              {availabilityData.beds?.detailedBeds?.pediatric?.total?.available || 0}/
                              {availabilityData.beds?.detailedBeds?.pediatric?.total?.total || 0}
                            </span>
                            {expandedSections.pediatric ? <FaAngleUp /> : <FaAngleDown />}
                          </div>
                        </div>
                        
                        {expandedSections.pediatric && (
                          <div className="p-3 bg-white">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-2 bg-gray-50 rounded text-center">
                                <p className="text-sm font-semibold">NICU</p>
                                <p className="font-bold">
                                  {availabilityData.beds?.detailedBeds?.pediatric?.nicu?.available || 0}/
                                  {availabilityData.beds?.detailedBeds?.pediatric?.nicu?.total || 0}
                                </p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded text-center">
                                <p className="text-sm font-semibold">PICU</p>
                                <p className="font-bold">
                                  {availabilityData.beds?.detailedBeds?.pediatric?.picu?.available || 0}/
                                  {availabilityData.beds?.detailedBeds?.pediatric?.picu?.total || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctor Availability Section */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
                    <FaUserMd /> Doctor Availability
                  </h3>
                  
                  {/* Doctor Status Summary */}
                  <div className="bg-white border border-green-200 rounded-md p-4 mb-4">
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center p-2 rounded bg-blue-50">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {availabilityData.doctors?.summary?.total || 0}
                        </p>
                      </div>
                      <div className="text-center p-2 rounded bg-green-50">
                        <p className="text-sm text-gray-600">Available</p>
                        <p className="text-2xl font-bold text-green-600">
                          {availabilityData.doctors?.summary?.available || 0}
                        </p>
                      </div>
                      <div className="text-center p-2 rounded bg-yellow-50">
                        <p className="text-sm text-gray-600">Busy</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {availabilityData.doctors?.summary?.busy || 0}
                        </p>
                      </div>
                      <div className="text-center p-2 rounded bg-red-50">
                        <p className="text-sm text-gray-600">Unavailable</p>
                        <p className="text-2xl font-bold text-red-600">
                          {availabilityData.doctors?.summary?.unavailable || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Specializations Section */}
                  {availabilityData.doctors?.specializations?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-gray-700">Available Specialists</h4>
                      <div className="bg-white border border-gray-200 rounded-md p-3">
                        <div className="space-y-2">
                          {availabilityData.doctors.specializations.map((spec, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                              <span className="font-medium">{spec.name}</span>
                              <div className="flex items-center">
                                <span className="text-green-600 font-bold">{spec.available}</span>
                                <span className="text-gray-400 mx-1">/</span>
                                <span className="text-gray-600">{spec.total}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Doctor Lists */}
                  <div className="space-y-4">
                    {/* Available Doctors */}
                    {availabilityData.doctors?.details?.available?.length > 0 && (
                      <div className="border border-green-200 rounded-md overflow-hidden">
                        <div className="bg-green-100 p-2 flex justify-between items-center">
                          <h4 className="font-semibold text-green-800">Available Doctors</h4>
                          <span className="bg-white text-green-600 px-2 py-1 rounded-full text-sm font-bold">
                            {availabilityData.doctors.details.available.length}
                          </span>
                        </div>
                        <div className="p-3 bg-white max-h-60 overflow-y-auto">
                          <ul className="space-y-2">
                            {availabilityData.doctors.details.available.map((doctor, idx) => (
                              <li key={idx} className="border-b pb-2 last:border-b-0">
                                <p className="font-bold">{doctor.name}</p>
                                <p className="text-gray-600">{doctor.specialization}</p>
                                {doctor.note && doctor.note !== "-" && (
                                  <p className="text-sm text-gray-500 italic">{doctor.note}</p>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    {/* Busy Doctors */}
                    {availabilityData.doctors?.details?.busy?.length > 0 && (
                      <div className="border border-yellow-200 rounded-md overflow-hidden">
                        <div className="bg-yellow-100 p-2 flex justify-between items-center">
                          <h4 className="font-semibold text-yellow-800">Busy Doctors</h4>
                          <span className="bg-white text-yellow-600 px-2 py-1 rounded-full text-sm font-bold">
                            {availabilityData.doctors.details.busy.length}
                          </span>
                        </div>
                        <div className="p-3 bg-white max-h-40 overflow-y-auto">
                          <ul className="space-y-2">
                            {availabilityData.doctors.details.busy.map((doctor, idx) => (
                              <li key={idx} className="border-b pb-2 last:border-b-0">
                                <p className="font-bold">{doctor.name}</p>
                                <p className="text-gray-600">{doctor.specialization}</p>
                                {doctor.note && doctor.note !== "-" && (
                                  <p className="text-sm text-gray-500 italic">{doctor.note}</p>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p>Error loading availability data</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyHospitals;
