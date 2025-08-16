const express = require('express');
const router = express.Router();
const Genre = require('../models/Genre');

// Create
router.post('/', async (req, res) => {
  try {
    var post = req.body;
    const user = await Genre.create(post);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read All
router.get('/', async (req, res) => {
  const users = await Genre.find();
  res.json(users);
});

// Read One
router.get('/:id', async (req, res) => {
  try {
    const user = await Genre.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Genre not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const user = await Genre.findByIdAndUpdate(
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
    await Genre.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Genre deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
