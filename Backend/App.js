const express = require('express');
const crypto = require('crypto');
require('dotenv').config(); // to use environment variables
const connectdb = require("./dbconfig/dbconfig")
const authroutes = require('./Routes/authRoutes')
const hospitalRoutes = require('./Routes/HospitalRoutes')
const doctorRoutes = require('./Routes/DoctorRoutes')
const locationRoutes = require("./Routes/LocationRoutes");
const AmbulanceRoutes = require('./Routes/AmbulanceRoutes')
const transferRoutes = require('./Routes/transferRoutes')
const messageRoutes = require('./Routes/messageRoutes')
const cors = require('cors');

// Import socket configuration from utils
const { app, server, io } = require('./utils/socket');
const port = process.env.PORT || 5000;

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
