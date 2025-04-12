import React, { useState } from "react";
import axios from "axios";

const NearbyHospitals = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState("");

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

          console.log("Sending to API:", { userid, latitude, longitude });
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



  //nearby hospital useeffect

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

      {/* Placeholder for Hospital List */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Nearby Hospitals</h2>
        {/* You can map hospital list here */}
        <p className="text-gray-500">Hospital list will appear here...</p>
      </div>
    </div>
  );
};

export default NearbyHospitals;
