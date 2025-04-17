import React, { useEffect, useState } from "react";
import axios from "axios";

import HeartbeatLoader from "../Components/HeartbeatLoader";

const NearbyHospitals = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(false);

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
          <p className="text-gray-500"><HeartbeatLoader/></p>
         
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NearbyHospitals;
