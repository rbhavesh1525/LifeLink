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
        <div className="text-4xl">🏥</div>
        <h2 className="text-lg font-semibold text-center mt-4">Update Hospital Profile</h2>
        <p className="text-gray-600 text-center mt-2 pb-5">Update your hospital information here.</p>
        <Link to="/update-hospital-profile" className="w-40">
         <button className="w-40 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer mt-6">
           Update Now 
        </button>
        </Link>
      </div>

     
      <div
        className="w-110 h-55 bg-white rounded-lg shadow-md border border-gray-300 hover:border-gray-500 flex flex-col items-center p-6 transition-all duration-300"
        
      >
        <div className="text-4xl">🚑</div>
        <h2 className="text-lg font-semibold text-center mt-4">Transfer Patient</h2>
        <p className="text-gray-600 text-center mt-2 pb-5">Transfer patients from one hospital to another.</p>
        <button className="w-40 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer mt-6">
          Transfer Now
        </button>
      </div>

    
      <div
        className="w-110 h-55 bg-white rounded-lg shadow-md border border-gray-300 hover:border-gray-500 flex flex-col items-center p-6 transition-all duration-300"
       
      >
        <div className="text-4xl">🩺</div>
        <h2 className="text-lg font-semibold text-center mt-4">Doctor Availability</h2>
        <p className="text-gray-600 text-center mt-2 pb-5">View and update doctor's availability.</p>
        <button className="w-40 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer mt-6">
          Update Now
        </button>
      </div>

     
      <div
        className="w-110 h-55 bg-white rounded-lg shadow-md border border-gray-300 hover:border-gray-500 flex flex-col items-center p-6 transition-all duration-300"
      
      >
        <div className="text-4xl">🛏️</div>
        <h2 className="text-lg font-semibold text-center mt-4">Update Bed Status</h2>
        <p className="text-gray-600 text-center mt-2 pb-5">View and update bed status.</p>
        <button className="w-40 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer mt-6">
          Update Status
        </button>
      </div>

     
      <div
        className="w-110 h-55 bg-white rounded-lg shadow-md border border-gray-300 hover:border-gray-500 flex flex-col items-center p-6 transition-all duration-300"
       
      >
        <div className="text-4xl">📄</div>
        <h2 className="text-lg font-semibold text-center mt-4">Patients Transfer Records</h2>
        <p className="text-gray-600 text-center mt-2 pb-5">View patients' transfer records.</p>
        <button className="w-40 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer mt-6">
          View Records
        </button>
      </div>

      
      <div
        className="w-110 h-55 bg-white rounded-lg shadow-md border border-gray-300 hover:border-gray-500 flex flex-col items-center p-6 transition-all duration-300"
       
      >
        <div className="text-4xl">👨‍⚕️</div>
        <h2 className="text-lg font-semibold text-center mt-4">Staff Info</h2>
        <p className="text-gray-600 text-center mt-2 pb-5">View and update staff information.</p>
        <button className="w-40 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer mt-6">
          Update Staff
        </button>
      </div>
    </div>
  );
};

export default HospitalServicesDashboard;
