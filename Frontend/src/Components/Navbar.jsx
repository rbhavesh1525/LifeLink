import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [loggedin, setLoggedin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setLoggedin(!!token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedin(false); 
    navigate("/"); 
  };

  return (
    <nav className="bg-white border-b border-gray-300 px-6 py-3 flex justify-between items-center shadow-sm">
      {/* Logo Section */}
      <div className="text-xl font-bold">LifeLink</div>

      {/* Navigation Links */}
      <ul className="flex space-x-6 text-gray-700">
        <li className="cursor-pointer hover:text-gray-900">Home</li>
        <li className="cursor-pointer hover:text-gray-900">About</li>
        <li className="cursor-pointer hover:text-gray-900">Services</li>
        <li className="cursor-pointer hover:text-gray-900">Contact</li>
      </ul>

      {/* User Profile OR Login Button */}
      {loggedin ? (
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
            <span className="text-gray-600">U</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/signin")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      )}
    </nav>
  );
}

export default Navbar;
