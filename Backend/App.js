const express = require('express');
const crypto = require('crypto');
require('dotenv').config(); // to use environment variables
const connectdb = require("./dbconfig/dbconfig")
const app = express();
const authroutes = require('./Routes/authRoutes')
const hospitalRoutes = require('./Routes/HospitalRoutes')
const doctorRoutes = require('./Routes/DoctorRoutes')
const cors = require('cors');
const port = process.env.PORT || 5000;

// const generateSecretKey = (length = 32) => {
//     return crypto.randomBytes(length).toString("hex");
//   };
  
//   console.log("Generated Secret Key:", generateSecretKey(64));

app.use(express.json()); 

app.use(cors());
app.use('/api/auth',authroutes);
app.use('/api',doctorRoutes);
app.use('/api',hospitalRoutes);




connectdb();
app.listen(port,()=>{
    console.log("server is running on port 5000")
})