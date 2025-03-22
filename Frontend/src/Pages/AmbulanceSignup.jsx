"use client";

import { useState } from "react";
import axios from "axios";
import { Car, User } from "lucide-react";

function AmbulanceSignup() {
  const [ambulanceData, setAmbulanceData] = useState({
    driverName: "",
    driverAddress: "",
    driverLicense: "",
    driverExperience: "",
    ambulanceNumber: "",
    ambulanceType: "",
    vehicleName: "",
    contactNumber: "",
    operatingArea: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setAmbulanceData({ ...ambulanceData, [name]: value });
  };

  const handleAmbulanceDataSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("YOUR_API_ENDPOINT", ambulanceData);
      console.log(response.data);
      setAmbulanceData({
        driverName: "",
        driverAddress: "",
        driverLicense: "",
        driverExperience: "",
        ambulanceNumber: "",
        ambulanceType: "",
        vehicleName: "",
        contactNumber: "",
        operatingArea: "",
      });
    } catch (error) {
      console.error("Error submitting ambulance details:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-800 mb-2">Signup As Ambulance</h1>
      </div>

      <form onSubmit={handleAmbulanceDataSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Driver Information */}
          <div className="border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <User className="h-5 w-5" />
              <h2 className="text-xl font-bold">Driver Information</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="driver_name" className="block text-sm font-medium mb-2">
                  Driver Full Name
                </label>
                <input
                  type="text"
                  id="driver_name"
                  name="driverName"
                  value={ambulanceData.driverName}
                  onChange={handleOnChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="driver_address" className="block text-sm font-medium mb-2">
                  Driver Address
                </label>
                <input
                  type="text"
                  id="driver_address"
                  name="driverAddress"
                  value={ambulanceData.driverAddress}
                  onChange={handleOnChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="driver_license" className="block text-sm font-medium mb-2">
                  License (Upload Image)
                </label>
                <input
                  type="file"
                  id="driver_license"
                  name="driverLicense"
                  accept="image/*"
                  onChange={handleOnChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="driver_experience" className="block text-sm font-medium mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="driver_experience"
                  name="driverExperience"
                  value={ambulanceData.driverExperience}
                  onChange={handleOnChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Ambulance Details */}
          <div className="border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Car className="h-5 w-5" />
              <h2 className="text-xl font-bold">Ambulance Details</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="ambulance_number" className="block text-sm font-medium mb-2">
                  Ambulance Number
                </label>
                <input
                  type="text"
                  id="ambulance_number"
                  name="ambulanceNumber"
                  value={ambulanceData.ambulanceNumber}
                  onChange={handleOnChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="ambulance_type" className="block text-sm font-medium mb-2">
                  Ambulance Type
                </label>
                <select
                  id="ambulance_type"
                  name="ambulanceType"
                  value={ambulanceData.ambulanceType}
                  onChange={handleOnChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Basic Life Support">Basic Life Support (BLS)</option>
                  <option value="Advanced Life Support">Advanced Life Support (ALS)</option>
                  <option value="Patient Transport">Patient Transport Ambulance</option>
                  <option value="Neonatal Ambulance">Neonatal Ambulance</option>
                  <option value="Air Ambulance">Air Ambulance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="vehicle_name" className="block text-sm font-medium mb-2">
                  Vehicle Name
                </label>
                <input
                  type="text"
                  id="vehicle_name"
                  name="vehicleName"
                  value={ambulanceData.vehicleName}
                  onChange={handleOnChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="contact_number" className="block text-sm font-medium mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contact_number"
                  name="contactNumber"
                  value={ambulanceData.contactNumber}
                  onChange={handleOnChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="operating_area" className="block text-sm font-medium mb-2">
                  Operating Area (City/Region)
                </label>
                <input
                  type="text"
                  id="operating_area"
                  name="operatingArea"
                  value={ambulanceData.operatingArea}
                  onChange={handleOnChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-purple-800 text-white py-2 px-4 rounded-md hover:bg-purple-900 transition-colors"
                >
                  Signup
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <p className="text-center text-sm mt-6">
          Already have an account? <a href="/ambulance-signin" className="text-blue-500">Login</a>
        </p>
    </div>
  );
}

export default AmbulanceSignup;
