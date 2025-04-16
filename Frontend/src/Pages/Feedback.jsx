import React, { useState } from "react";
import { Star } from "lucide-react"; // or use your own icons

function Feedback(){
  const [activeTab, setActiveTab] = useState("hospital");
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = () => {
    const payload = {
      category: activeTab,
      stars,
      feedback,
      name,
    };
    console.log("Submitting to fake API: ", payload);
    alert("Feedback submitted! Thank you ❤️");

    // Reset form
    setStars(0);
    setFeedback("");
    setName("");
  };

  return (
    <div className="h-[50] bg-gradient-to-br from-blue-50 to-white flex flex-col items-center p-6 bg-transparent">
      <h1 className="text-3xl font-bold mb-4 text-blue-900">Feedback Portal</h1>

      {/* Tabs */}
      <div className="flex mb-6 space-x-4">
        {["hospital", "ambulance"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-white font-semibold transition ${
              activeTab === tab
                ? "bg-blue-600 shadow-lg"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            {tab === "hospital" ? "🏥 Hospital" : "🚑 Ambulance"}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-4">
        {/* Star Rating */}
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <Star
              key={num}
              size={28}
              onClick={() => setStars(num)}
              className={`cursor-pointer transition ${
                num <= stars ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Feedback Input */}
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          placeholder="Write your feedback..."
          className="w-full border border-gray-300 rounded-xl p-3 resize-none focus:outline-blue-400"
        />

        {/* Name */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full border border-gray-300 rounded-xl p-3 focus:outline-blue-400"
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition shadow-lg"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default Feedback;
