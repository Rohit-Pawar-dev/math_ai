const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'Invalid email',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: 'Invalid password',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: true,
      message: 'Login successful',
      data: user,
      token,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
});


// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid email' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: process.env.JWT_EXPIRES_IN
//     });

//     res.json({ user, token });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.post('/signup-otp', async (req, res) => {
  try {
    let { email, password, mobile } = req.body;

    email = email?.trim();
    mobile = mobile?.trim();

    if (await User.findOne({ email })) {
      return res.status(409).json({ status: false, message: 'Email already in use' });
    }

    if (await User.findOne({ mobile })) {
      return res.status(409).json({ status: false, message: 'Mobile number already in use' });
    }

    let otp = Math.floor(1000 + Math.random() * 9000)

    res.status(201).json({ status: true, message: 'OTP Sent Successfully', otp });
  } catch (err) {
    res.status(400).json({ status: false, message: err.message, token: '' });
  }
});

router.post('/register', async (req, res) => {
  try {
    let { email, password, mobile } = req.body;

    email = email?.trim();
    mobile = mobile?.trim();
    password = password?.trim();

    if (await User.findOne({ email })) {
      return res.status(409).json({ status: false, message: 'Email already in use' });
    }

    if (await User.findOne({ mobile })) {
      return res.status(409).json({ status: false, message: 'Mobile number already in use' });
    }

    if (!password) {
      return res.status(400).json({ status: false, message: 'Password is required' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object with hashed password
    const userData = {
      ...req.body,
      email,
      mobile,
      password: hashedPassword,
    };

    const user = await User.create(userData);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Exclude password from user data before sending response
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      status: true,
      message: 'User registered successfully',
      data: userObj,
      token,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});


// router.post('/register', async (req, res) => {
//   try {
//     let { email, password, mobile } = req.body;

//     email = email?.trim();
//     mobile = mobile?.trim();

//     if (await User.findOne({ email })) {
//       return res.status(409).json({ status: false, message: 'Email already in use' });
//     }

//     if (await User.findOne({ mobile })) {
//       return res.status(409).json({ status: false, message: 'Mobile number already in use' });
//     }

//     let hashedPassword = '';
//     if (password && password.trim() !== '') {
//       const salt = await bcrypt.genSalt(10);
//       hashedPassword = await bcrypt.hash(password, salt);
//     }

//     const user = await User.create(req.body);

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: process.env.JWT_EXPIRES_IN,
//     });

//     res.status(201).json({ status: true, message: 'User registered successfully', token });
//   } catch (err) {
//     res.status(400).json({ status: false, message: err.message, token: '' });
//   }
// });


router.post('/send-otp', async (req, res) => {
  try {
    const { mobile, type } = req.body;
    
    let otp = Math.floor(1000 + Math.random() * 9000);
    if(type == 'login') {

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

    const user = await User.findOne({ mobile });
    if (!user) return res.status(400).json({ status: false, otp:'', message: 'Invalid mobile or user not registered' });

    console.log(`User OTP: ${user.otp}, Provided OTP: ${otp}`);
    
    const isMatch = otp == user.otp;
    if (!isMatch) return res.status(400).json({ status: false, message: 'Invalid OTP' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.json({status:true, message:'OTP verified successfully', token: token });
    
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

module.exports = router;
