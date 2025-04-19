const {Server} = require("socket.io")
const http = require("http")
const express = require("express")

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"],
        credentials: true
    }
})

const userSocketMap = {}

function getReceiverSocketId(userId){
    return userSocketMap[userId]
}

io.on("connection",(socket) => {
    console.log("A user Connected", socket.id);
    
    // Get userId from query parameters
    const userId = socket.handshake.query.userId;
    
    if(userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} connected with socket ${socket.id}`);
        
        // Emit online users to all clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
    
    // Direct messaging between users
    socket.on("sendMessage", (messageData) => {
        console.log("Socket message received:", messageData);
        const receiverSocketId = getReceiverSocketId(messageData.receiverId);
        if (receiverSocketId) {
            console.log(`Sending message to socket ID: ${receiverSocketId}`);
            io.to(receiverSocketId).emit("newMessage", messageData);
        } else {
            console.log(`Receiver socket not found for user ID: ${messageData.receiverId}`);
        }
    });

    // Transfer notifications
    socket.on("transferInitiated", (transferData) => {
        console.log("Transfer initiated:", transferData);
        const receiverSocketId = getReceiverSocketId(transferData.destinationHospital);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newTransfer", transferData);
        }
    });

    // Support for room-based chat (legacy)
    socket.on("join_room",(data)=>{
        socket.join(data); 
        console.log(`User with id: ${socket.id} joined room: ${data}`)
    });

    socket.on("send_message",(data)=>{
        console.log("Room message:", data)
        socket.to(data.room).emit("receive_message", data)
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        
        // Find and remove the user from userSocketMap
        for (const [id, socketId] of Object.entries(userSocketMap)) {
            if (socketId === socket.id) {
                delete userSocketMap[id];
                console.log(`User ${id} disconnected and removed from socket map`);
                break;
            }
        }
        
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = {io, app, server, getReceiverSocketId}

    