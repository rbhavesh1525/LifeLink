import React, { useState } from "react";
import { showToast } from "./Toast";
const UserProfile = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    nickName: "",
    gender: "",
    country: "",
    language: "",
    timeZone: "",
  });

  const handleSaveProfile=()=>{
    showToast("Profile saved successfully")
  }

  const [isEditing, setIsEditing] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Get initials for profile circle
  const getInitials = (name) => {
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0][0]?.toUpperCase();
    return `${names[0][0]?.toUpperCase()}${names[1][0]?.toUpperCase()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Top Banner */}
        <div className="h-32 w-full bg-gradient-to-r from-blue-200 via-purple-100 to-yellow-100"></div>

        {/* Profile Info */}
        <div className="px-8 -mt-14 flex items-center justify-between flex-wrap">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold border-4 border-white">
              {getInitials(userData.fullName)}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">{userData.fullName || "Your Name"}</h2>
              <p className="text-sm text-gray-500">{userData.email}</p>
            </div>
          </div>
          <button
  onClick={() => {
    if (isEditing) {
      handleSaveProfile(); // Show toast
    }
    setIsEditing(!isEditing); // Toggle edit mode
  }}
  className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 mt-4 lg:mt-0"
>
  {isEditing ? "Save" : "Edit"}
</button>

        </div>

        {/* Form Section */}
        <div className="px-8 py-10">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSaveProfile}>
            {[
              { label: "Full Name", name: "fullName" },
              { label: "Nick Name", name: "nickName" },
              { label: "Gender", name: "gender" },
              { label: "Country", name: "country" },
              { label: "Language", name: "language" },
              { label: "Time Zone", name: "timeZone" },
              {label:"Email" , name:"email"}
            ].map((field) => (
              <div key={field.name}>
                <label className="text-sm text-gray-600 font-medium">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={userData[field.name]}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder={`Your ${field.label}`}
                  className={`mt-1 w-full px-4 py-2 rounded-md border ${
                    isEditing ? "bg-white border-gray-300" : "bg-gray-100 border-gray-200"
                  } focus:outline-none focus:ring-2 focus:ring-blue-300`}
                />
              </div>
            ))}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
