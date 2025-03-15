const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
       
      },
      lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        
      },
      registeringAs: {
        type: String,
        required: [true, "Registering type is required"],
        enum: ["User", "Ambulance","Hospital"], 
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"], // Email regex
      },
      password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
      },
    },
    
    { timestamps: true });

    const User = mongoose.model("User",userSchema);


    module.exports = User;
    