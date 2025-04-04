import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

function Chat({ socket, username, room }) {
    const [currentmsg, setCurrentMsg] = useState("");
    const [messagelist, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentmsg.trim() !== "") {
            const messagedata = {
                room: room,
                author: username,
                message: currentmsg,
                time: new Date().getHours() + ":" + new Date().getMinutes(),
            };

            await socket.emit("send_message", messagedata);
            setMessageList((list) => [...list, messagedata]);
            setCurrentMsg(""); 
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, [socket]);

    return (
        <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white text-center py-3 text-lg font-semibold">
                Live Chat
            </div>

            {/* Chat Body (Scrollable Area) */}
            <div className="h-64 overflow-y-auto p-4 bg-gray-100 flex flex-col space-y-2">
                {messagelist.map((messageContent, index) => {
                    const isSentByUser = messageContent.author === username;
                    return (
                        <div key={index} className={`flex ${isSentByUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-2 rounded-lg text-white max-w-xs break-words ${isSentByUser ? 'bg-blue-500' : 'bg-gray-500'}`}>
                                <p className="text-sm">{messageContent.message}</p>
                                <span className="text-xs opacity-75">{messageContent.time}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Chat Footer */}
            <div className="flex items-center p-4 border-t bg-white">
                <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentmsg}
                    onChange={(e) => setCurrentMsg(e.target.value)}
                />
                <button 
                    onClick={sendMessage} 
                    className="ml-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </div>
        </div>
    );
}

// ✅ Prop Validation
Chat.propTypes = {
    socket: PropTypes.object.isRequired,
    username: PropTypes.string.isRequired,
    room: PropTypes.string.isRequired
};

export default Chat;
