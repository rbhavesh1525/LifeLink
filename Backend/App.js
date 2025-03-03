const express = require('express');

require('dotenv').config(); // to use environment variables

const app = express();

const port = process.env.PORT || 5000;

app.get('/', (req, res)=>{
    res.send('Hello World from Express');
})


app.listen(port,()=>{
    console.log("server is running on port 3000")
})