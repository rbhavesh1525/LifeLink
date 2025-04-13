const express = require('express');
const crypto = require('crypto');
require('dotenv').config(); // to use environment variables
const connectdb = require("./dbconfig/dbconfig")
const app = express();
const authroutes = require('./Routes/authRoutes')
const hospitalRoutes = require('./Routes/HospitalRoutes')
const doctorRoutes = require('./Routes/DoctorRoutes')
const locationRoutes = require("./Routes/LocationRoutes");
const AmbulanceRoutes = require('./Routes/AmbulanceRoutes')
const transferRoutes = require('./Routes/transferRoutes')
const messageRoutes = require('./Routes/messageRoutes')
const cors = require('cors');
const http = require('http');
const jwt = require('jsonwebtoken');

const {Server} = require('socket.io');
const server = http.createServer(app); 
const port = process.env.PORT || 5000;

// Track online users with their socket IDs
const userSocketMap = {};

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"]
    },
});

// Socket middleware for authentication
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication token not provided"));
        }

        // First decode without verification to check the role
        const decodedWithoutVerify = jwt.decode(token);
        
        // Select the appropriate secret key based on role
        let secretKey;
        if (decodedWithoutVerify.role === 'hospital') {
            secretKey = process.env.HOSPITAL_SECRET_KEY;
        } else if (decodedWithoutVerify.role === 'ambulance') {
            secretKey = process.env.AMBULANCE_SECRET_KEY;
        } else {
            secretKey = process.env.JWT_SECRET_KEY;
        }

        // Verify with the correct secret key
        const decoded = jwt.verify(token, secretKey);
        socket.userId = decoded.id;
        socket.userRole = decoded.role;
        next();
    } catch (error) {
        console.error("Socket authentication error:", error.message);
        next(new Error("Authentication failed"));
    }
});

io.on("connection",(socket)=>{
    console.log(`Socket connected: ${socket.id}`);
    
    const userId = socket.userId;
    
    if(userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} connected with socket ${socket.id}`);
    }
    
    // Emit online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Support for room-based chat (legacy)
    socket.on("join_room",(data)=>{
        socket.join(data); 
        console.log(`User with id: ${socket.id} joined room: ${data}`)
    });

    socket.on("send_message",(data)=>{
        console.log("Room message:", data)
        socket.to(data.room).emit("receive_message", data)
    });

    // Direct messaging between users
    socket.on("sendMessage", (messageData) => {
        console.log("Socket message received:", messageData);
        const receiverSocketId = userSocketMap[messageData.receiverId];
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
        const receiverSocketId = userSocketMap[transferData.destinationHospital];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newTransfer", transferData);
        }
    });

    socket.on("disconnect",()=>{
        console.log(`Socket disconnected: ${socket.id}`);
        
        // Remove from online users
        if (userId) {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        }
    });
});

app.use(express.json()); 
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use('/api/auth',authroutes);
app.use('/api',doctorRoutes);
app.use('/api',hospitalRoutes);
app.use('/api',locationRoutes);
app.use('/api/ambulance',AmbulanceRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/messages', messageRoutes);

// Connect to database
connectdb();
server.listen(port,()=>{
    console.log("server is running on port 5000")
})
