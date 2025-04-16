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
      path: "/nearby-ambulance",
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
    <>
    <section  id="homepage" />
    <div className="min-h-screen bg-gray-50">
   

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 md:px-16 mt-10">
  {services.map((service) => (
    <Link
      key={service.id}
      to={service.path}
      className={`
        relative p-[1px] rounded-lg transition-all duration-300
        hover:bg-gradient-to-r hover:from-blue-500 hover:to-teal-400
      `}
    >
      <div
        className={`
          h-full w-full rounded-lg p-6 ${service.color}
          shadow-md hover:shadow-lg transition duration-300
          flex flex-col items-center text-center
          bg-white border border-gray-300
        `}
      >
        {service.icon}
        <h3 className="text-lg font-semibold mt-4">{service.title}</h3>
        <p className="text-gray-600 mt-2">{service.description}</p>
        <div className="mt-6">
          <button className="border-2 px-4 py-1 rounded-md border-blue-500 hover:bg-blue-100 transition cursor-pointer">
            {service.btntext}
          </button>
        </div>
      </div>
    </Link>
  ))}
</div>

    </div>
    </>
  );
}

export default UserHomepage;