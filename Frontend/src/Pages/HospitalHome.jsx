import React from "react";
import { Link } from "react-router-dom";

const HospitalServicesDashboard = () => {
  // Separate click handlers for each card
  const handleUpdateProfile =()=>{

  }
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-20">
      
      <div
        className="w-110 h-55 bg-white rounded-lg shadow-md border border-gray-300 hover:border-gray-500 flex flex-col items-center p-6 transition-all duration-300"
        onClick={handleUpdateProfile}
      >
        <div className="text-4xl mb-4">🏥</div>
        <h2 className="text-lg font-semibold text-center">Update Hospital Profile</h2>
        <p className="text-gray-600 text-center mt-2 flex-grow">Update your hospital information here.</p>
        <Link to="/update-hospital-profile" className="w-full mt-4">
         <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
           Update Now 
        </button>
        </Link>
      </div>

     
      <div
        className="w-110 h-55 bg-white rounded-lg shadow-md border border-gray-300 hover:border-gray-500 flex flex-col items-center p-6 transition-all duration-300"
        
      >
        <div className="text-4xl mb-4">🚑</div>
        <h2 className="text-lg font-semibold text-center">Transfer Patient</h2>
        <p className="text-gray-600 text-center mt-2 flex-grow">Transfer patients from one hospital to another.</p>
        <Link to="/transfer-patient" className="w-full mt-4">
        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
          Transfer Now
        </button></Link>
      </div>

    
      <div
        className="w-110 h-55 bg-white rounded-lg shadow-md border border-gray-300 hover:border-gray-500 flex flex-col items-center p-6 transition-all duration-300"
       
      >
        <div className="text-4xl mb-4">🩺</div>
        <h2 className="text-lg font-semibold text-center">Doctor Availability</h2>
        <p className="text-gray-600 text-center mt-2 flex-grow">View and update doctor's availability.</p>
        <Link to="/doctor-availability" className="w-full mt-4">
        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
          Update Now
        </button>
        </Link>
      </div>

     
      <div
        className="w-110 h-55 bg-white rounded-lg shadow-md border border-gray-300 hover:border-gray-500 flex flex-col items-center p-6 transition-all duration-300"
      
      >
        <div className="text-4xl mb-4">🛏️</div>
        <h2 className="text-lg font-semibold text-center">Update Bed Status</h2>
        <p className="text-gray-600 text-center mt-2 flex-grow">View and update bed status.</p>
        <Link to="/update-bed-status" className="w-full mt-4">
        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
          Update Status
        </button>
        </Link>
      </div>

     
      <div
        className="w-110 h-55 bg-white rounded-lg shadow-md border border-gray-300 hover:border-gray-500 flex flex-col items-center p-6 transition-all duration-300"
       
      >
        <div className="text-4xl mb-4">📄</div>
        <h2 className="text-lg font-semibold text-center">Patients Transfer Records</h2>
        <p className="text-gray-600 text-center mt-2 flex-grow">View patients' transfer records.</p>
        <Link to="/patient-transfer-records" className="w-full mt-4">
        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
          View Records
        </button>
        </Link>

      </div>

      
      <div
        className="w-110 h-55 bg-white rounded-lg shadow-md border border-gray-300 hover:border-gray-500 flex flex-col items-center p-6 transition-all duration-300"
       
      >
        <div className="text-4xl mb-4">👨‍⚕️</div>
        <h2 className="text-lg font-semibold text-center">Staff Info</h2>
        <p className="text-gray-600 text-center mt-2 flex-grow">View and update staff information.</p>
        <Link to="/staff-info" className="w-full mt-4">
        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
          Update Staff
        </button>
        </Link>
      </div>
    </div>
  );
};

export default HospitalServicesDashboard;
