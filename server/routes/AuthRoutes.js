const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create
// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    var post = req.body;
    const user = await User.create(post);

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(201).json({status:true, message:'User Registered succesfully', token});
  } catch (err) {
    res.status(400).json({status:false, message: err.message, token:'' });
  }
});

router.post('/send-otp', async (req, res) => {
  try {
    const { mobile, type } = req.body;
    
    let otp = Math.floor(1000 + Math.random() * 9000);
    if(type == 'login') {
      // Find user
      const user = await User.findOne({ mobile });
      if (!user) return res.status(400).json({ status: false, otp:'', message: 'Invalid mobile or user not registered' });
  
      await User.findByIdAndUpdate(user._id, {
        otp: otp
      });
  
      res.json({ status: true, otp: otp.toString(), message: 'OTP sent to registered mobile number' });
    } else {

      const user = await User.findOne({ mobile });
      if (user) return res.status(400).json({ status: false, otp:'', message: 'Mobile number already registered. Please login.' });
      
      res.json({ status: true, otp: otp.toString(), message: 'OTP sent to mobile number' });
    }
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    // Find user
    const user = await User.findOne({ mobile });
    if (!user) return res.status(400).json({ status: false, otp:'', message: 'Invalid mobile or user not registered' });

    // Compare passwords
    const isMatch = otp == user.otp;
    if (!isMatch) return res.status(400).json({ status: false, message: 'Invalid OTP' });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.json({status:true, message:'OTP verified successfully', token: token });
    
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

module.exports = router;
