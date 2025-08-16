const express = require('express');
const router = express.Router();
const User = require('../models/User');
const upload = require('../utils/multer');
const nlogger = require('../logger');



// Create
router.post('/', async (req, res) => {
  try {

    nlogger.info('Create User')

    var post = req.body;
    const user = await User.create(post);
    res.status(201).json(user);
  } catch (err) {
    nlogger.info('Create User Error' + err)
    res.status(400).json({ error: err.message });
  }
});

// Read All
router.get('/', async (req, res) => {
  nlogger.info(`Retriving Users List ${req?.query?.search}`)

  const searchText = req?.query?.search ?? '';

  const users = await User.find(
    {
      'role':'user',
      $or: [
        { name: { $regex: searchText, $options: 'i' } },
        { mobile: { $regex: searchText, $options: 'i' } },
        { email: { $regex: searchText, $options: 'i' } }
      ]
    },
  );
  res.json(users);
});

// Read One
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Upload profile picture
router.post('/upload-profile', upload.single('profile'), async (req, res) => {
  try {
    const userId = req.body.userId;
    const filePath = req.file.path; // 'uploads/filename.png'

    await User.findByIdAndUpdate(userId, {
      profilePicture: filePath
    });

    res.status(200).json({ message: 'File uploaded successfully', filePath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
