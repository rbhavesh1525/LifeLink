
const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;
const dbconnect = async(req,res)=>{
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
}

module.exports = dbconnect;