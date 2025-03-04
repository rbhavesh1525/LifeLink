const express = require('express');

require('dotenv').config(); // to use environment variables
const connectdb = require("./dbconfig/dbconfig")
const app = express();

const port = process.env.PORT || 5000;

app.get('/', (req, res)=>{
    res.send('Hello World from Express');
})

connectdb();
app.listen(port,()=>{
    console.log("server is running on port 5000")
})