const auth = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const View = require('../models/View');
const User = require('../models/User');
const Content = require('../models/Content');
const HomeScreen = require('../models/HomeApp');

// Create
router.post('/', async (req, res) => {
  try {
    var post = req.body;
    const user = await HomeScreen.create(post);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read All
router.get('/', async (req, res) => {
  const users = await HomeScreen.find();
  res.json(users);
});

// Read One
router.get('/:id', async (req, res) => {
  try {
    const user = await HomeScreen.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'HomeScreen not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const user = await HomeScreen.findByIdAndUpdate(
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
    await HomeScreen.findByIdAndDelete(req.params.id);
    res.json({ msg: 'HomeScreen deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/home', async (req, res) => {

    res.json({ status:true, message: 'Home App', data:[] });
});

module.exports = router;