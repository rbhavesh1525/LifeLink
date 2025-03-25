const express = require('express');
const bcrypt = require('bcryptjs')
const User = require('../Models/authModel')
const Hospital = require('../Models/HospitalAuthModel');
const Ambulance = require('../Models/AmbulanceAuthModel');
const upload = require('../Middleware/upload');
const jwt = require('jsonwebtoken');

require('dotenv').config();


const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const HOSPITAL_SECRET_KEY = process.env.HOSPITAL_SECRET_KEY;
const AMBULANCE_SECRET_KEY = process.env.AMBULANCE_SECRET_KEY;

const UserSignup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,

            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: "Signup Successfull! Please log in" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error signing up", error: error.message });
    }
};


const UserSignin = async (req, res) => {
    try {

        const { email, password } = req.body;


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'user not found' });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, { expiresIn: "7day" })

        res.status(200).json({ message: "Signin Successfull", token, user })

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: "Error signing in", error: error.message });
    }


};



const registerHospital = async (req, res) => {
    try {
        const {
            hospitalName,
            hospitalType,
            hospitalRegistrationNumber,
            hospitalDescription,
            hospitalAddress,
            hospitalPhone,
            hospitalEmail,
            hospitalWebsite,
            hospitalPassword
        } = req.body;
        if (!hospitalType) {
            return res.status(400).json({ message: "Hospital type is required" });
        }
        // Check if hospital already exists
        let existingHospital = await Hospital.findOne({ 
            $or: [
                { hospitalEmail }, 
                { hospitalRegistrationNumber }
            ] 
        });

        if (existingHospital) {
            return res.status(400).json({ message: "Email or Registration Number already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(hospitalPassword, 10);

        // Create new hospital
       const newhospital = new Hospital({
            hospitalName,
            hospitalType,
            hospitalRegistrationNumber,
            hospitalDescription,
            hospitalAddress,
            hospitalPhone,
            hospitalEmail,
            hospitalWebsite,
            hospitalPassword: hashedPassword
        });
        

        await newhospital.save();
        res.status(201).json({ message: "Hospital registered successfully" });

    } catch (error) {
        console.error("Error in hospital registration:", error);
        res.status(500).json({ message: "Server error" });
    }
};





const loginHospital = async (req, res) => {
    try {
        const { hospitalEmail, hospitalPassword } = req.body;

       
        const hospital = await Hospital.findOne({ hospitalEmail });
        if (!hospital) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        
        const isMatch = await bcrypt.compare(hospitalPassword, hospital.hospitalPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

       
        const token = jwt.sign(
            { id: hospital._id, role: "hospital" },  
            HOSPITAL_SECRET_KEY,         
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: hospital._id,
                hospitalName: hospital.hospitalName,
                hospitalEmail: hospital.hospitalEmail,
                hospitalType: hospital.hospitalType,
            },
        });
    } catch (error) {
        console.error("Error in hospital login:", error);
        res.status(500).json({ message: "Server error" });
    }
};


//ambulance resgitration

const registerAmbulance = async (req, res) => {
    try {
      console.log("Uploaded File:", req.file);  // Debugging
      console.log("Request Body:", req.body); 
  
      if (!req.file) {
        return res.status(400).json({ message: "File upload failed" });
      }
  
        const hashedPassword = await bcrypt.hash(req.body.driverPassword, 10);

      // Create new ambulance
      const newAmbulance = new Ambulance({
        driverName: req.body.driverName,
        driverEmail: req.body.driverEmail,
        driverAddress: req.body.driverAddress,
        driverLicense: req.file.path,  
        driverExperience: req.body.driverExperience,
        ambulanceNumber: req.body.ambulanceNumber,
        ambulanceType: req.body.ambulanceType,
        vehicleName: req.body.vehicleName,
        contactNumber: req.body.contactNumber,
        operatingArea: req.body.operatingArea,
        driverPassword:hashedPassword,
      });
  
      await newAmbulance.save();
      res.status(201).json({ message: "Ambulance registered successfully!" });
    } catch (error) {
      console.error("Registration Error:", error);
      res.status(500).json({ message: "Server Error", error });
    }
  };
  
  
  // ✅ **2. Login Ambulance**
  const loginAmbulance = async (req, res) => {
    try {
      const { driverEmail, driverPassword } = req.body;
  
      // Check if ambulance exists
      const ambulance = await Ambulance.findOne({ driverEmail });
      if (!ambulance) {
        return res.status(404).json({ message: "Ambulance not found" });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(driverPassword, ambulance.driverPassword);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: ambulance._id, driverEmail: ambulance.driverEmail }, AMBULANCE_SECRET_KEY, { expiresIn: "1h" });
  
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Error in login", error: error.message });
      }
  };





module.exports = { UserSignup, UserSignin, registerHospital, loginHospital, registerAmbulance, loginAmbulance }