const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { User } = require("../Models/user.model");
const { OTP } = require("../Models/otp.model"); // Import the OTP model
const router = express.Router();
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const axios = require("axios");

dotenv.config();

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};

const sendOTP = async (email, generatedOTP) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "OTP for Verification",
      text: `Here is Your OTP for Verifying your Email: ${generatedOTP}`,
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const register = async (req, res) => {
  try {
    const { password, email, fullName } = req.body;

    if (!password || !email || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOTP();
    const otpSent = await sendOTP(email, otp);

    if (!otpSent) {
      return res.status(500).json({ message: "Failed to send OTP Try again" });
    }

    // Store the OTP in the OTP collection
    await OTP.findOneAndUpdate(
      { email },
      { otp, otpExpires: Date.now() + 300000 }, // 5 minutes expiration
      { upsert: true, new: true }
    );
    res.status(200).json({ message: "OTP sent for email verification" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, enteredOTP, password, fullName } = req.body;
    console.log(req.body);

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ message: "session expired try gaian" });
    }
    if (otpRecord.otp != enteredOTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (otpRecord.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const initials = `${email.charAt(0)}`.toUpperCase();
    const photo = `https://ui-avatars.com/api/?name=${initials}&size=150&background=ffffff&color=7c3aed`;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
      photo,
    });

    await newUser.save();

    // Delete OTP record after successful verification
    await OTP.deleteOne({ email });

    res
      .status(200)
      .json({ message: "User verified and registered successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    const userDetailsIncomplete =
      !user.phoneno ||
      !user.gender ||
      !user.dateofbirth ||
      !user.address 

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        photo: user.photo,
        phoneno: user.phoneno ? user.phoneno : null,
      },
      userDetailsIncomplete,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getalluser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error getting all user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getuserbyid = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error getting user by id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTrialCount = async (req, res) => {
  const user = req.user;
  res.status(200).json({ trialCount: user.trialCount });
};

const getIsPaid = async (req, res) => {
  const user = req.user;
  res.status(200).json({ isPaid: user.isPaid });
};

const updateIsPaid = async (req, res) => {
  const user = req.user;
  user.isPaid = true;
  await user.save();
  res.status(200).json({ message: "User updated successfully", isPaid: user.isPaid });
};
module.exports = {
  register,
  verifyOTP,
  login,
  getalluser,
  getuserbyid,
  getTrialCount,
  getIsPaid,
  updateIsPaid,
};
