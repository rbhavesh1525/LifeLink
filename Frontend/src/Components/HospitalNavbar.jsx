import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { showToast } from "./Toast";
import useAuthStore from "../Store/authStore";
import { useChat } from "../context/MessageContext";
import NotificationPanel from "./NotificationPanel";

function HospitalNavbar() {
  const [isLogin, setIsLogin] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { notifications } = useChat();
  const dropdownRef = useRef(null);
  
  // Use local state for unread count to force re-renders
  const [unreadCount, setUnreadCount] = useState(0);

  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  // Update unread count whenever notifications change
  useEffect(() => {
    if (notifications) {
      const count = notifications.filter(n => !n.read).length;
      console.log(`Updating unread count: ${count} from ${notifications.length} notifications`);
      setUnreadCount(count);
    } else {
      setUnreadCount(0);
    }
  }, [notifications]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogin(!!token);

    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    showToast("Logout successfully");
    setIsLogin(false);
    setDropdownOpen(false);
    navigate("/hospital-homepage");
  };

  const toggleNotifications = () => {
    console.log("Toggle notifications button clicked");
    console.log("Current notifications:", notifications);
    console.log(`Unread count: ${unreadCount}`);
    setIsNotificationOpen(!isNotificationOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-300 px-6 py-3 flex justify-between items-center shadow-sm">
        <div className="text-xl font-bold">LifeLink</div>

        {/* Navigation Links */}
        <ul className="flex space-x-6 text-gray-700">
          <li className="cursor-pointer hover:text-gray-900">
            <Link to="/hospital-homepage">Home</Link>
          </li>
          <li className="cursor-pointer hover:text-gray-900">About us</li>
          <li className="cursor-pointer hover:text-gray-900">Services</li>
          <li className="cursor-pointer hover:text-gray-900">
            <Link to="/hospital-chat">Chat</Link>
          </li>
        </ul>

        <div className="flex items-center">
          {isLogin && (
            <button
              onClick={toggleNotifications}
              className="mr-4 relative"
              aria-label="Notifications"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600 hover:text-gray-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          )}

          {!isLogin ? (
            <button
              onClick={() => navigate("/signing-as")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
            >
              Login
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center text-gray-700 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-2">
                  {user?.hospitalName?.charAt(0) || 'H'}
                </div>
                <span className="mr-1">{user?.hospitalName || 'Hospital'}</span>
                <svg
                  className={`w-4 h-4 ml-1 transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <Link
                    to="/hospital-profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/hospital-settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </>
  );
}

export default HospitalNavbar;
