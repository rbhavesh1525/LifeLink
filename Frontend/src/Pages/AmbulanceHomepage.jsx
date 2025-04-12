import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserInjured, FaAmbulance, FaEllipsisH } from 'react-icons/fa';

function AmbulanceHomepage() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Today's Patient Transfers",
      icon: <FaUserInjured size={40} className="text-blue-600" />,
      desc: "View and manage today's patient transport activities.",
      btnText: "View Transfers",
      path: "/ambulance/patient-transfers",
    },
    {
      title: "Update Ambulance Info",
      icon: <FaAmbulance size={40} className="text-green-600" />,
      desc: "Modify ambulance availability and driver details.",
      btnText: "Update Info",
      path: "/ambulance/update-info",
    },
    {
      title: "Other",
      icon: <FaEllipsisH size={40} className="text-gray-600" />,
      desc: "Access additional ambulance services or logs.",
      btnText: "Explore",
      path: "/ambulance/other",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">🚑 Ambulance Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white shadow-md rounded-2xl p-6 text-center border hover:shadow-lg transition">
            <div className="flex justify-center mb-4">{card.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
            <p className="text-sm text-gray-600 mb-4">{card.desc}</p>
            <button
              onClick={() => navigate(card.path)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
            >
              {card.btnText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AmbulanceHomepage;
