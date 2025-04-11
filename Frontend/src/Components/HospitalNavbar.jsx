import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "./Toast";
import useAuthStore from "../Store/authStore";

function HospitalNavbar() {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogin(!!token);
  }, []);

  const handleLogout = () => {
    logout();
    showToast("Logout successfully");
    setIsLogin(false);
    navigate("/hospital-homepage");
  };

  return (
    <nav className="bg-white border-b border-gray-300 px-6 py-3 flex justify-between items-center shadow-sm">
      <div className="text-xl font-bold">LifeLink</div>

      {/* Navigation Links */}
      <ul className="flex space-x-6 text-gray-700">
        <li className="cursor-pointer hover:text-gray-900">Home</li>
        <li className="cursor-pointer hover:text-gray-900">About us</li>
        <li className="cursor-pointer hover:text-gray-900">Services</li>
        <li className="cursor-pointer hover:text-gray-900">Transfer data</li>
      </ul>

      {!isLogin ? (
        <button
          onClick={() => navigate("/signing-as")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Login
        </button>
      ) : (
        <button
          onClick={handleLogout}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Logout
        </button>
      )}
    </nav>
  );
}

export default HospitalNavbar;
