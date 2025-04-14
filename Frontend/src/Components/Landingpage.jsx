import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import HealthImg from "../assets/Images/Health-Insurance.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full h-[50vh] bg-cover object-cover bg-center" style={{ backgroundImage: `url(https://t4.ftcdn.net/jpg/05/50/83/61/360_F_550836159_9ZAJDg8t9F7WOqrMbrD0Wlp7BAaWRrw4.jpg)` }}>
      {/* Overlay for darkening the image */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-extrabold leading-tight mb-4 animate__animated animate__fadeIn animate__delay-1s">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
            One Stop for All Your Problems
          </span>
        </h1>
        <p className="text-2xl text-white mb-6 animate__animated animate__fadeIn animate__delay-2s max-w-3xl">
          Your health, wellness, and solutions – all under one roof. Professional care, anytime.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
