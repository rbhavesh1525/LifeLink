const express = require('express');
const bcrypt = require('bcryptjs')
const User = require('../Models/authModel')
const jwt = require('jsonwebtoken');

require('dotenv').config();


const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const Signup = async(req,res)=>{
    try{
    const {firstName,lastName,registeringAs,email,password } = req.body;


    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message: 'Email already exists'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        firstName,
        lastName,
        registeringAs,
        email,
        password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({message:"Signup Successfull! Please log in"})
}catch(error){
    console.error(error);
    res.status(500).json({message: "Error signing up", error: error.message});
}
};


const Signin = async(req,res)=>{
    try{

        const {email,password} = req.body;


        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: 'user not found'});
        }


        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const token = jwt.sign({id:user._id},JWT_SECRET_KEY,{expiresIn:"7day"})
            
        res.status(200).json({message:"Signin Successfull",token,user})

    }catch(error){

        console.error(error);
        res.status(500).json({message: "Error signing in", error: error.message});
    }


};

module.exports = {Signup, Signin};