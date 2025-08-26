const express = require('express');
const router = express.Router();
const Media = require('../models/Media');
const upload = require('../utils/multer');

// Create
router.post('/', upload.single('content'), async (req, res) => {
  try {

    

    var post = {
      title:req.file.originalname,
      mimetype:req.file.mimetype,
      filename:req.file.filename,
      path:req.file.path,
      size:req.file.size,
    };

    const user = await Media.create(post);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read All
router.get('/', async (req, res) => {
  const users = await Media.find();
  res.json(users);
});

// Read One
router.get('/:id', async (req, res) => {
  try {
    const user = await Media.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Media not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const user = await Media.findByIdAndUpdate(
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
    await Media.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Media deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
