const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Create
router.post('/', async (req, res) => {
  try {
    var post = req.body;
    const user = await Note.create(post);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read All
router.get('/', async (req, res) => {
  const users = await Note.find().populate('user_id').sort({'created_at': -1});
  res.json(users);
});

// Read One
router.get('/:id', async (req, res) => {
  try {
    const user = await Note.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Note not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const user = await Note.findByIdAndUpdate(
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
    await Note.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Note deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
