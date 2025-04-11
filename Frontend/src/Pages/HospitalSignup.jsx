"use client"

import { useState } from "react"
import axios from "axios"
import { Building, Phone } from "lucide-react"
import { showToast } from "../Components/Toast"
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"

function HospitalSignup() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [hospitalprofiledata, setHospitalProfileData] = useState({
    hospitalName: "",
    hospitalType: "",
    hospitalRegistrationNumber: "",
    hospitalDescription: "",
    hospitalAddress: "",
    hospitalPhone: "",
    hospitalEmail: "",
    hospitalPassword: "",
    hospitalWebsite: "",
  })

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setHospitalProfileData({ ...hospitalprofiledata, [name]: value })
  }
  const navigate = useNavigate();
  const handleHospitalDataSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const response = await axios.post("http://localhost:5000/api/auth/hospital-signup", hospitalprofiledata)
      console.log(response.data)
      showToast("Hospital Signup Successful!", "success");
      setHospitalProfileData({
        hospitalName: "",
        hospitalType: "",
        hospitalRegistrationNumber: "",
        hospitalDescription: "",
        hospitalAddress: "",
        hospitalPhone: "",
        hospitalEmail: "",
        hospitalPassword: "",
        hospitalWebsite: "",
      })
      navigate("/hospital-signin")
    } catch (error) {
      console.error("❌ Error in Hospital Signup:", error)
      // showToast("❌ Error in Hospital Signup:","error")


      const errormessage = error.response?.data.message || "Signup Failed. Please try again.";
      setError(errormessage)

      showToast(`❌ ${errormessage}`, "error");
    }
  }

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-800 mb-2">Signup As Hospital</h1>
        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {message && (
          <p className="text-green-500 text-2xl">{message}</p>
        )}

      </div>

      <form onSubmit={handleHospitalDataSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Building className="h-5 w-5" />
              <h2 className="text-xl font-bold">Basic Information</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="hospital_name" className="block text-sm font-medium mb-2">
                  Hospital Name
                </label>
                <input
                  type="text"
                  id="hospital_name"
                  name="hospitalName"
                  value={hospitalprofiledata.hospitalName}
                  onChange={handleOnChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="hospital_type" className="block text-sm font-medium mb-2">
                  Hospital Type
                </label>
                <select
                  id="hospital_type"
                  name="hospitalType"
                  value={hospitalprofiledata.hospitalType}
                  onChange={handleOnChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none bg-white"
                >
                  <option value="" disabled>
                    Select Hospital Type
                  </option>
                  <option value="General Hospital">General Hospital</option>
                  <option value="Specialized Hospital">Specialized Hospital</option>
                  <option value="Children Hospital">Children Hospital</option>
                  <option value="Mental Health Hospital">Mental Health Hospital</option>
                  <option value="Psychiatric Hospital">Psychiatric Hospital</option>
                  <option value="Emergency Hospital">Emergency Hospital</option>
                  <option value="Nursing Home">Nursing Home</option>
                  <option value="Home Healthcare">Home Healthcare</option>
                  <option value="Long-term Care Hospital">Long-term Care Hospital</option>
                  <option value="Other">Other</option>
                </select>

              </div>

              <div>
                <label htmlFor="Hospital_Registration_number" className="block text-sm font-medium mb-2">
                  Registraion Number
                </label>
                <input
                  type="text"
                  id="Hospital_Registration_number"
                  name="hospitalRegistrationNumber"
                  value={hospitalprofiledata.hospitalRegistrationNumber}
                  onChange={handleOnChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="hospital_description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="hospital_description"
                  name="hospitalDescription"
                  value={hospitalprofiledata.hospitalDescription}
                  onChange={handleOnChange}
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Phone className="h-5 w-5" />
              <h2 className="text-xl font-bold">Contact Information</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="hospital_address" className="block text-sm font-medium mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="hospital_address"
                  name="hospitalAddress"
                  value={hospitalprofiledata.hospitalAddress}
                  onChange={handleOnChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="hospital_phone" className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="hospital_phone"
                  name="hospitalPhone"
                  value={hospitalprofiledata.hospitalPhone}
                  onChange={handleOnChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="hospital_email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="hospital_email"
                  name="hospitalEmail"
                  value={hospitalprofiledata.hospitalEmail}
                  onChange={handleOnChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="hospital_password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="hospital_password"
                  name="hospitalPassword"
                  value={hospitalprofiledata.hospitalPassword}
                  onChange={handleOnChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="hospital_website" className="block text-sm font-medium mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="hospital_website"
                  name="hospitalWebsite"
                  value={hospitalprofiledata.hospitalWebsite}
                  onChange={handleOnChange}
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
      <div className="signin-option">
        <p className="text-center text-sm mt-6">
          Already have an account? <a href="/hospital-signin" className="text-blue-500">Login</a>
        </p>
      </div>
    </div>
  )
}

export default HospitalSignup;

