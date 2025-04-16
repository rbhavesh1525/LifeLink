import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "./Toast";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAuthStore from "../Store/authStore";

function Navbar() {
  const [isLogin, setIsLogin] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    checkLoginStatus();
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const checkLoginStatus = async () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsLogin(true);
    }
  };

  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    showToast("Logout successfully");
    setIsLogin(false);
    navigate("/");
  };

  const handleDropDown = () => {
    setDropdown(!dropdown);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdown(false);
    }
  };

  // Get the appropriate home page link based on user type
  const getHomePageLink = () => {
    if (!user) return "/";
    
    // Check user type based on role
    switch (user.role) {
      case "hospital":
        return "/hospital-homepage";
      case "ambulance":
        return "/ambulance-homepage";
      case "user":
        return "/user-homepage";
      default:
        return "/";
    }
  };

  return (
    <nav className="bg-white border-b border-gray-300 px-6 py-5 flex justify-between items-center shadow-sm">
    {/* Logo Section */}
    <div 
      className="text-xl font-bold cursor-pointer bg-gradient-to-r from-blue-500 to-teal-400 text-transparent bg-clip-text transition-transform duration-300 hover:scale-105" 
      onClick={() => navigate(getHomePageLink())}
    >
      LifeLink
    </div>
  
    {/* Search + Nav Links */}
   
      {/* Sexy Search Bar */}
      <div
        className={`w-72 lg:w-96 flex  gap-3 px-0.5 py-0.5 rounded-full transition-all duration-300 mr-4  ${
          isFocused
            ? "border-2 border-transparent p-[2px] bg-gradient-to-r from-blue-500 to-teal-400"
            : "border-2 border-gray-300"
        }`}
      >
        <div className="flex  bg-white rounded-full px-3 py-1 w-full relative">
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="bg-transparent outline-none text-gray-700 w-full pl-3 pr-10"
          />
           <FaSearch className="text-gray-500 absolute right-3 cursor-pointer" />
        </div>
      </div>
      
      <div className="nav-elements mr-40">
  
      {/* Navigation Links */}
      <ul className="flex space-x-8 text-gray-700 font-semibold pr-9">
        <li 
          className="cursor-pointer text-gray-800 hover:text-gray-900"
          onClick={() => navigate(getHomePageLink())}
        >
          Home
        </li>
       <Link to="/about-us" > <li className="cursor-pointer text-gray-900 hover:text-blue-600">About us</li> </Link>
     <Link to="/Services">   <li className="cursor-pointer text-gray-900 hover:text-blue-600">Services</li></Link>
      <Link to="/contact-us">  <li className="cursor-pointer text-gray-900 hover:text-blue-600">Contact us</li></Link>
      </ul>
      </div>
   
  
  
    {!isLogin ? (
      <button
        onClick={() => navigate("/signing-as")}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
      >
        Login
      </button>
    ) : (
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center space-x-2 w-12 h-10 rounded-full bg-gray-200 justify-center cursor-pointer"
          onClick={handleDropDown}
        >
          <span className="text-gray-600 font-medium">
            {user?.firstName?.[0] || user?.hospitalName?.[0] || user?.driverName?.[0] || "U"}
          </span>
          <span className="text-gray-600 text-sm">{dropdown ? "▲" : "▼"}</span>
        </div>
  
        {dropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md border border-gray-200 z-50">
            <ul className="flex flex-col text-gray-700">
              <li
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => navigate("/user-profile")}
              >
                Profile
              </li>
              <li
                className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                onClick={() => navigate("/user-help")}
              >
                Help
              </li>
              <li
                className="cursor-pointer px-4 py-2 text-red-500 hover:bg-gray-100"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    )}
  </nav>
  
  );
}

export default Navbar;
