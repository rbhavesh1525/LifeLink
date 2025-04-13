import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, MapPin, Search, PhoneCall } from "lucide-react";

function NearbyAmbulances() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [ambulances, setAmbulances] = useState([]);
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

          try {
            const response = await axios.post(
              "http://localhost:5000/api/save-location",
              { latitude, longitude, userid }
            );

            setMessage("📍 Location updated successfully!");
            console.log("Location saved to backend:", response.data);
            fetchNearbyAmbulances(latitude, longitude); // Fetch ambulances right after
          } catch (apiErr) {
            console.error("API Error while saving location:", apiErr);
            setError("❌ Failed to save location");
          }

          setLoading(false);
        },
        (err) => {
          setError("❌ Location access denied or not available");
          setLoading(false);
        }
      );
    } else {
      setError("❌ Geolocation not supported");
      setLoading(false);
    }
  };

  const userdata = JSON.parse(localStorage.getItem("user"));
  const userId = userdata?.id;

  console.log(userId)

  const fetchNearbyAmbulances = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/ambulance/nearby-ambulance/${userId}`
      );
      setAmbulances(res.data);
    } catch (err) {
      console.log("Error fetching ambulances", err);
    }
  };

  const filteredAmbulances = ambulances.filter((amb) =>
    amb.driverName?.toLowerCase().includes(search.toLowerCase())
  );






  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <button
          onClick={updateLocation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200"
        >
          <MapPin className="w-5 h-5" />
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              Updating...
            </>
          ) : (
            "Update My Location"
          )}
        </button>

        <input
          type="text"
          placeholder="Search by driver name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 px-4 py-2 rounded-full border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Messages */}
      {message && <p className="text-green-600 font-semibold">{message}</p>}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Nearby Ambulances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAmbulances.length === 0 ? (
          <p className="col-span-full text-center text-gray-600 text-lg">
            🚑 No ambulances found nearby.
          </p>
        ) : (
          filteredAmbulances.map((ambulance, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-blue-700">
                  {ambulance.driverName || "Unnamed Driver"}
                </h2>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ambulance.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {ambulance.status}
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                <strong>Phone:</strong> {ambulance.phone || "N/A"}
              </p>
              <button className="flex items-center gap-2 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-sm transition">
                <PhoneCall className="w-4 h-4" />
                Call Now
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NearbyAmbulances;
