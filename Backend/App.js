const express = require('express');
const crypto = require('crypto');
require('dotenv').config(); // to use environment variables
const connectdb = require("./dbconfig/dbconfig")
<<<<<<< Updated upstream
const app = express();
const authroutes = require('./Routes/authRoutes')
const hospitalRoutes = require('./Routes/HospitalRoutes')
const doctorRoutes = require('./Routes/DoctorRoutes')
const locationRoutes = require("./Routes/LocationRoutes");
const AmbulanceRoutes = require('./Routes/AmbulanceRoutes')
const cors = require('cors');
const http = require('http');

const {Server} = require('socket.io');
const server = http.createServer(app); 
const port = process.env.PORT || 5000;

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"]
    },
});


io.on("connection",(socket)=>{
    console.log(socket.id ,"connected");

    socket.on("join_room",(data)=>{
        socket.join(data); 
        console.log(`user with id: ${socket.id} joined room: ${data}`)
    });


    socket.on("send_message",(data)=>{
        console.log(data)
        socket.to(data.room).emit("receive_message",data)
    })


socket.on("disconnect",()=>{
    console.log(socket.id," User disconnected");
})

});



=======
const cors = require('cors');
const { app, server } = require('./utils/socket');
const authRoutes = require('./Routes/authRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const transferRoutes = require('./Routes/transferRoutes');

const port = process.env.PORT || 5000;

// Middleware
>>>>>>> Stashed changes
app.use(express.json()); 
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

<<<<<<< Updated upstream
app.use(cors());
app.use('/api/auth',authroutes);
app.use('/api',doctorRoutes);
app.use('/api',hospitalRoutes);
app.use('/api',locationRoutes);
app.use('/api/ambulance',AmbulanceRoutes)


=======
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/transfer', transferRoutes);
>>>>>>> Stashed changes

// Connect to database
connectdb();
<<<<<<< Updated upstream
server.listen(port,()=>{
    console.log("server is running on port 5000")
})
=======

// Start server (using http server from socket.js)
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
>>>>>>> Stashed changes
