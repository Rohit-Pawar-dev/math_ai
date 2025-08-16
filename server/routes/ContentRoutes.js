const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

// Create
router.post('/', async (req, res) => {
  try {
    var post = req.body;
    const user = await Content.create(post);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read All
router.get('/', async (req, res) => {
  const series = await Content.aggregate([
    {
      $match: { type: "series" }  // Optional: only get series-type content
    },
    {
      $lookup: {
        from: "episodes",               // Collection name (case-sensitive!)
        localField: "_id",
        foreignField: "series",
        as: "episodes"
      }
    }
  ]);
  res.json(series);
});

// Read One
router.get('/:id', async (req, res) => {
  try {
    const user = await Content.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Content not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const user = await Content.findByIdAndUpdate(
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
    await Content.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Content deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
