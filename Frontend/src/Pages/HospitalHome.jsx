import React from "react";
import { HospitalServices } from "./HospitalDashboard";
import { Link } from "react-router-dom";

const HospitalHome = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-20">
      {HospitalServices.map((service) => (
        <div
          key={service.id}
          className="w-110 h-55 bg-white rounded-lg shadow-md border border-gray-300 hover:border-gray-500 flex flex-col items-center p-6 transition-all duration-300"
        >
          <div className="text-4xl">{service.icon || "🏥"}</div>

          <h2 className="text-lg font-semibold text-center mt-4">
            {service.name}
          </h2>

          <p className="text-gray-600 text-center mt-2">
            {service.description}
          </p>

          <div className="mt-auto">
            <Link to={service.path}>
              {" "}
              <button className="w-40 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer mt-6">
                {service.buttontext}
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HospitalHome;
