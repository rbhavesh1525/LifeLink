import React from "react";

const UserHelp = () => {
  return (
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Header with background */}
      <div
        className="w-full h-[300px] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-white"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/91/70/17/917017949818ccfe4475e5f7f65979b6.jpg')",
        }}
      >
        <h1 className="text-3xl font-semibold mb-4">How can we help?</h1>
        <div className="flex space-x-2 w-full max-w-lg px-4">
          <input
            type="text"
            placeholder="Search Beacon, Docs, Reports, etc"
            className="w-full px-4 py-2 rounded-md text-black focus:outline-none border-2"
          />
          <button className="bg-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-800 cursor-pointer">
            Search
          </button>
        </div>
      </div>

      {/* Help Desk Section */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Help Desk</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Booking Ambulance",
              desc:
                "Learn how to quickly book an ambulance during emergencies with real-time tracking and support.",
              count: "8 articles",
              icon: "/help-icon.png", // Replace with actual icon
            },
            {
              title: "Search Hospital",
              desc:
                "Discover how to find hospitals near you, check facilities, availability, and specialties.",
              count: "30 articles",
              icon: "/tools-icon.png",
            },
            {
              title: "Ask Query",
              desc:
                "Submit your medical queries, get expert responses, and access our FAQ section for common concerns.",
              count: "11 articles",
              icon: "/report-icon.png",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md p-6 text-center"
            >
              <div className="text-4xl mb-4">📘</div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
              <p className="text-blue-600 mt-3 text-sm font-medium">
                {item.count}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserHelp;
