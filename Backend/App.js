const express = require('express');
const crypto = require('crypto');
require('dotenv').config(); // to use environment variables
const connectdb = require("./dbconfig/dbconfig")
const app = express();
const authroutes = require('./Routes/authRoutes')
const cors = require('cors');
const port = process.env.PORT || 5000;



app.use(express.json()); 

app.use(cors());
app.use('/api/auth',authroutes);




connectdb();
app.listen(port,()=>{
    console.log("server is running on port 5000")
})