const {Server} = require("socket.io")
const http = require("http")
const express = require("express")
const jwt = require("jsonwebtoken")

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"],
        credentials: true
    }
})

const userSocketMap = {}

// Socket middleware for authentication
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication token not provided"));
        }

        // Verify token (adjust secret key to match your JWT secret)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
    } catch (error) {
        console.error("Socket authentication error:", error.message);
        next(new Error("Authentication failed"));
    }
});

function getReceiverSocketId(userId){
    return userSocketMap[userId]
}

io.on("connection",(socket) => {
    console.log("A user Connected", socket.id);
    const userId = socket.userId;
    
    if(userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} connected with socket ${socket.id}`);
    }
    
    // Emit online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Listen for chat messages
    socket.on("sendMessage", (messageData) => {
        const receiverSocketId = getReceiverSocketId(messageData.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", messageData);
        }
    });

    // Listen for transfer notifications
    socket.on("transferInitiated", (transferData) => {
        const receiverSocketId = getReceiverSocketId(transferData.destinationHospital);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newTransfer", transferData);
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = {io, app, server, getReceiverSocketId}

    