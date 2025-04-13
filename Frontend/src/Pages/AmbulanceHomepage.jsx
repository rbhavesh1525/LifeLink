import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserInjured, FaAmbulance, FaEllipsisH } from 'react-icons/fa';
import { showToast } from '../Components/Toast';

function AmbulanceHomepage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("inactive");
  const [message,setMessage] = useState("");

  const toggleStatus = async () => {
    const newStatus = status === "active" ? "inactive" : "active";
    setStatus(newStatus);
    localStorage.setItem(newStatus);

   
  
    const newMessage = newStatus === "active"
    ? "Welcome Back !"
    : "Hey, want to get back to work!";

    setMessage(newMessage);

    const ambulancedata = JSON.parse(localStorage.getItem(("user")));

    const ambulanceId = ambulancedata?.id;
    if(!ambulanceId) return ;
  
    console.log(ambulanceId)
    try {
      // Send request to update status by ambulance ID
    const response =  await axios.post(`http://localhost:5000/api/ambulance/update-status/${ambulanceId}`, {
        status: newStatus
      });
      console.log("Status updated successfully");
      console.log(response.data.status)

      if(response.data.status==='active'){
        showToast("Welcome Back Life Saver")
      }
      
      if(response.data.status==='inactive'){
        showToast("Come Back Soon Life Saver")
      }
  
     
    } catch (error) {
      console.error("Error updating status", error);
    }
  };


  //ambulance location sending to backend 

  useEffect(()=>{

    const ambulanceData = JSON.parse(localStorage.getItem("user"));

    const ambulanceId = ambulanceData?.id;
    console.log(ambulanceId)

    const updateLocation =()=>{
      navigator.geolocation.getCurrentPosition(async(pos)=>{
        const {latitude,longitude} = pos.coords;

        await axios.post(`http://localhost:5000/api/ambulance/update-location/${ambulanceId}`,{
          latitude,
          longitude
        })
      })
    };

    const interval = setInterval(updateLocation,10000);
    return ()=> clearInterval(interval);

  },[])
  
  
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

    <>


    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">🚑 Ambulance Dashboard</h1>

      <div className="flex justify-center mb-6">
  <div
    onClick={toggleStatus}
    className={`relative w-24 h-12 rounded-full cursor-pointer transition-all duration-300 ease-in-out ${
      status === "active" ? "bg-green-400" : "bg-gray-400"
      
    }`}
  >
    {/* Toggle Knob */}
    <div
      className={`absolute top-0 left-0 w-12 h-12 rounded-full bg-white transition-all duration-300 ease-in-out 
        ${status === "active" ? "translate-x-12 ring-4 ring-green-600" : "ring-4 ring-red-500"}`}
    ></div>
  </div>
</div>

<div className="message text-center p-2 font-semibold">
{message}
</div>





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
    </>
  );
}

export default AmbulanceHomepage;
