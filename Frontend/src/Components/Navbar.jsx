


import React from "react";

function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-300 px-6 py-3 flex justify-between items-center shadow-sm">
      {/* Logo Section */}
      <div className="text-xl font-bold">Porter</div>

      {/* Navigation Links */}
      <ul className="flex space-x-6 text-gray-700">
        <li className="cursor-pointer hover:text-gray-900">Home</li>
        <li className="cursor-pointer hover:text-gray-900">About</li>
        <li className="cursor-pointer hover:text-gray-900">Services</li>
        <li className="cursor-pointer hover:text-gray-900">Contact</li>
      </ul>

      {/* User Profile */}
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
        <span className="text-gray-600">U</span>
      </div>
    </nav>
  );
};

export default Navbar;
