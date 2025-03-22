import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "./Toast";
import useAuthStore from "../Store/authStore";

function Navbar() {
  const [isLogin, setIsLogin] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    checkLoginStatus();
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const checkLoginStatus = async () => {
    const token = localStorage.getItem("token");
    console.log("Token check:", token);
    setIsLogin(!!token);
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
      {!isLogin ? (
        <button
          onClick={() => navigate("/signing-as")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Login
        </button>
      ) : (
        <div className="relative" ref={dropdownRef}>
          {/* User Avatar with Dropdown Icon */}
          <div
            className="flex items-center space-x-2 w-12 h-10 rounded-full bg-gray-200 justify-center cursor-pointer"
            onClick={handleDropDown}
          >
            <span className="text-gray-600 font-medium">{"U"}</span>
            <span className="text-gray-600 text-sm">{dropdown ? "▲" : "▼"}</span>
          </div>

          {/* Dropdown Menu */}
          {dropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md border border-gray-200">
              <ul className="flex flex-col text-gray-700">
                <li
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </li>
                <li
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={() => navigate("/help")}
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
