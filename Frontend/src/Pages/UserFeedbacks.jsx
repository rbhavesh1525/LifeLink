import React, { useState } from "react";
import Feedback from "./Feedback"; // ✅ Replace with correct path if needed

const feedbacks = [
  {
    name: "Rohit Sharma",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    stars: 4,
    message: "Ambulance reached in just 5 minutes. Truly a life saver 🙏.",
  },
  {
    name: "Neha Verma",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    stars: 5,
    message: "Hospital list was very clear and helpful. UI is smooth and fast!",
  },
  {
    name: "Ajay Kumar",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    stars: 3,
    message: "Could improve timing, but service was overall very helpful.",
  },
];

const UserFeedbacks = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className="bg-gray-50 py-10 px-4">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
        🌟 Feedbacks Received
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Feedback cards */}
        {feedbacks.map((fb, index) => (
          <div
            key={index}
            className="bg-white border border-gray-300 rounded-xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center space-x-4 mb-3">
              <img
                src={fb.image}
                alt={fb.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-800">{fb.name}</p>
                <div className="text-yellow-400 text-lg">
                  {"★".repeat(fb.stars) + "☆".repeat(5 - fb.stars)}
                </div>
              </div>
            </div>
            <p className="italic text-gray-700">“{fb.message}”</p>
          </div>
        ))}

        {/* ➕ Add Feedback Card in same row */}
        <div
          onClick={() => setIsPopupOpen(true)}
          className="flex items-center justify-center bg-white border border-gray-300 rounded-xl cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <span className="text-5xl text-gray-400">+</span>
        </div>
      </div>

      {/* Pop-up Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[95%] max-w-xl relative">
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-2 right-3 text-2xl text-gray-600 hover:text-black"
            >
              &times;
            </button>

            {/* Feedback form component */}
            <Feedback onClose={() => setIsPopupOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFeedbacks;
