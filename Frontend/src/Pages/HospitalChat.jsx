import { useEffect, useState } from "react";

import io from "socket.io-client";
import Chat from "./Chat";
const socket = io.connect("http://localhost:5000");
function HospitalChat() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
    const [showchat , setShowChat] = useState(false);
  const joinRoom = () => {
    if(username !== "" && room !==""){
           socket.emit("join_room",room); 
           setShowChat(true);
    }
  };

  return (
    <div className="app m-10">
        {!showchat ? (

        <div className="">
      <h3>Join a Chat</h3>
      <input
        type="text"
        placeholder="bhavesh.."
        onChange={(e) => {
          setUsername(e.target.value);
          
        }}

        className="border-2"

      />
      <input
        type="text"
        placeholder="Room id..."
        onChange={(e) => {
          setRoom(e.target.value);
        }}
        className="border-2 ml-4"
      />
      <button onClick={joinRoom} className="border-2 ml-3.5">Join A room</button>
      </div>

    ) : (

    
      <Chat  socket={socket}  username={username}  room = {room} />
    )}
    </div>



  );
   
}

export default HospitalChat;
