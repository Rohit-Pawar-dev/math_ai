const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');

// Create
router.post('/', async (req, res) => {
  try {
    var post = req.body;
    const user = await Setting.create(post);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read All
router.get('/', async (req, res) => {
  const users = await Setting.find();
  res.json(users);
});

// Read One
router.get('/:id', async (req, res) => {
  try {
    const user = await Setting.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Setting not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const user = await Setting.findByIdAndUpdate(
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
    await Setting.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Setting deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
