const express = require('express');
const router = express.Router();
const CoinTransaction = require('../models/CoinTransaction');
const auth = require('../middleware/authMiddleware');

// Create
router.post('/', auth, async (req, res) => {
  try {
    var post = req.body;


    // const user = await CoinTransaction.create(post);
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read All
router.get('/', async (req, res) => {
  const users = await CoinTransaction.find();
  res.json(users);
});

// Read One
router.get('/:id', async (req, res) => {
  try {
    const user = await CoinTransaction.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'CoinTransaction not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const user = await CoinTransaction.findByIdAndUpdate(
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
    await CoinTransaction.findByIdAndDelete(req.params.id);
    res.json({ msg: 'CoinTransaction deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
