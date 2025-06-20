import { useState, useEffect } from "react";
import AmbulanceImg from "../assets/Images/AmbulanceImg.jpg"
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
            // setError("❌ Failed to save location");
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

  useEffect(() => {
    const fetchNearbyAmbulances = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/ambulance/nearby-ambulances/${userId}`
        );
  
        const flattened = res.data.nearbyAmbulances.map((amb) => ({
          ...amb.details,
          location: amb.location,
          distanceKm: amb.distanceKm, // if you add distance later
        }));
  
        setAmbulances(flattened);
      } catch (err) {
        console.log("Error fetching ambulances", err);
      }
    };
  
    fetchNearbyAmbulances();
  }, [userId]);
  
  const filteredAmbulances = ambulances.filter((amb) =>
    amb.driverName?.toLowerCase().includes(search.toLowerCase())
  )



  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 ">
        <button
          onClick={updateLocation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 cursor-pointer"
        >
          <MapPin className="w-5 h-5 cursor-pointer" />
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
      <div className="grid grid-cols-1 gap-6">
  {filteredAmbulances.length === 0 ? (
    <p className="text-center text-gray-600 text-lg">
      🚑 No ambulances found nearby.
    </p>
  ) : (
    filteredAmbulances.map((ambulance, idx) => (
      <div
        key={idx}
        className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
      >
        {/* Image Section */}
        <img
          src={AmbulanceImg} 
          alt="Ambulance"
          className="w-full sm:w-64 h-48 sm:h-auto object-cover"
        />

        {/* Details Section */}
        <div className="p-4 flex-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-blue-700">
              {ambulance.driverName || "Unnamed Driver"}
            </h2>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                ambulance.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
             {/* {ambulance.status || "Inactive"} */}
            </span>
          </div>

          {/* Near You */}
          <p className="text-green-600 text-sm font-medium mb-2">
            📍 Available near you
          </p>

          {/* Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm text-gray-700 mb-3">
            <p>
              <strong>Type:</strong> {ambulance.ambulanceType || "N/A"}
            </p>
            <p>
              <strong>Number:</strong> {ambulance.ambulanceNumber || "N/A"}
            </p>
            <p>
              <strong>Experience:</strong> {ambulance.driverExperience} yrs
            </p>
            <p>
              <strong>Contact:</strong>{" "}
              <span className="text-blue-600 font-medium">
                {ambulance.contactNumber || "Not Available"}
              </span>
            </p>
          </div>

          {/* Call Button */}
          <button
            className="mt-2 w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center gap-2 transition-all cursor-pointer"
            onClick={() =>
              window.open(`tel:${ambulance.contactNumber}`, "_self")
            }
          >
            <PhoneCall className="w-4 h-4 " />
            Call Now
          </button>
        </div>
      </div>
    ))
  )}
</div>


    </div>
  );
}

export default NearbyAmbulances;
