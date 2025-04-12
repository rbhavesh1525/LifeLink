import React from "react";
import { Link } from "react-router-dom";
import { FaHospital, FaAmbulance, FaUserMd, FaSearch, FaMapMarkerAlt, FaPhone, FaClock } from "react-icons/fa";
import useAuthStore from "../Store/authStore";

function UserHomepage() {
  const user = useAuthStore((state) => state.user);

  const services = [
    {
      id: 1,
      icon: <FaHospital className="text-4xl text-blue-500" />,
      title: "Nearby Hospitals",
      description: "Search for hospitals based on location and specialties",
      path: "/nearby-hospitals",
      btntext: "Nearby Hospitals ",
      color: "bg-blue-50"
    },
    
    {
      id: 2,
      icon: <FaAmbulance className="text-4xl text-red-500" />,
      title: "Request Ambulance",
      description: "Quick access to emergency ambulance services",
      path: "/request-ambulance",
      btntext : "Book Ambulance",
      color: "bg-red-50"
    },
    
    {
      id: 3,
      icon: <FaSearch className="text-4xl text-purple-500" />,
      title: "Search Doctors",
      description: "Find doctors by specialty and location",
      path: "/search-doctors",
      btntext:"Search-doctors",
      color: "bg-purple-50"
    }

  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            Welcome, {user?.firstName || "User"}!
          </h1>
          <p className="text-xl opacity-90">
            Your one-stop platform for healthcare services
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {services.map((service) => (
            <Link
              key={service.id}
              to={service.path}
              className={`${service.color} p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`}
            >
              <div className="flex flex-col items-center text-center">
                {service.icon}
                <h3 className="text-lg font-semibold mt-4">{service.title}</h3>
                <p className="text-gray-600 mt-2">{service.description}</p>
                <button className="border-2 cursor-pointer p-2 ">{service.btntext}</button>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Emergency Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <FaPhone className="text-red-500 text-2xl" />
              <div>
                <h3 className="font-semibold">Emergency Helpline</h3>
                <p className="text-gray-600">24/7 Emergency Support</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaAmbulance className="text-red-500 text-2xl" />
              <div>
                <h3 className="font-semibold">Quick Ambulance</h3>
                <p className="text-gray-600">Immediate Response</p>
              </div>
            </div>
          </div>
        </div>


   
      </div>
    </div>
  );
}

export default UserHomepage;