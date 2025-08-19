const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Episode = require('../models/Episode');
const upload = require('../utils/zip');
const multer = require('multer');
const AdmZip = require("adm-zip");
const path = require("path");
const fs = require("fs");

// Create
router.post('/upload-zip/:series_id', async (req, res) => {
  try {
    var post = req.body;
    // const user = await Episode.create(post);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create
router.post('/:series_id', upload.single("zip_file"), async (req, res) => {
  try {
    var post = req.body;
    const series_id = req.params.series_id;
    const seriesId = new mongoose.Types.ObjectId(req.params.series_id);
    if (!series_id || !mongoose.Types.ObjectId.isValid(series_id)) {
      return res.status(400).json({ success: false, message: "Invalid or missing series_id" });
    }

    const zipPath = req.file.path;
    // Extract ZIP
    const zip = new AdmZip(zipPath);
    const extractPath = path.join(__dirname, "../uploads/episodes");

    if (!fs.existsSync(extractPath)) fs.mkdirSync(extractPath, { recursive: true });

    const extractedFiles = [];

    const episodeArr = []

    zip.getEntries().forEach((entry) => {
      if (entry.entryName.toLowerCase().endsWith(".mp4")) {
        const fileName = path.basename(entry.entryName);
        const fullPath = path.join(extractPath, fileName);
        fs.writeFileSync(fullPath, entry.getData());
        extractedFiles.push(`/uploads/episodes/${fileName}`);

        episodeArr.push({
          name: fileName,
          "episode_number": (fileName.split('-')[1]).split('.')[0],
          "season_number": 1,
          "series": series_id,
          "url":{
            "en":`/uploads/episodes/${fileName}`
          },
          "status":"active"
        })
      }
    });

    // for (const episode of episodeArr) {
    //   if (!episode.series || episode.series === '') {
    //     console.error("🔥 BAD EPISODE SERIES:", episode);
    //     continue;
    //   }
    // }

    episodeArr.forEach(async (ep, idx) => {
      await Episode.updateOne(
        { series: seriesId, episode_number: ep.episode_number },
        { $set: ep },
        { upsert: true }
      );
    });
    res.json({ status: true, episodes: extractedFiles });
  } catch (err) {


    res.status(400).json({ error: err.message });
  }
});

// Read All
router.get('/:series_id', async (req, res) => {
  const users = await Episode.find({"series":req.params.series_id}).sort({ episode_number: 1 });
  res.json(users);
});

// Read One
router.get('/:series_id/:id', async (req, res) => {
  try {
    const user = await Episode.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Episode 1 not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put('/:series_id/:id', async (req, res) => {
  try {
    const user = await Episode.findByIdAndUpdate(
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
    await Episode.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Episode deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
