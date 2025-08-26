const express = require('express');
const router = express.Router();
const View = require('../models/View');
const User = require('../models/User');
const Content = require('../models/Content');
const auth = require('../middleware/authMiddleware');
const CoinTransaction = require('../models/CoinTransaction');
const Setting = require('../models/Setting');

// Create
router.post('/', auth, async (req, res) => {
  try {
    var user = await User.findById(req.user.id);
    var post = req.body;
    // const user = await View.create(post);

    const createView = {
      series: post.series,
      user: post.user
    };

    var series = await Content.findById(post.series);
    if (!series) return res.status(404).json({'status': true, message: 'Series not found' });

    Content.findByIdAndUpdate(post.series)
    // const view = await View.create(post);

    const stat = await View.updateOne(
      { series: post.series, user: post.user },
      { $set: createView },
      { upsert: true }
    );

    const debit_coin = await Setting.findOne()
    if(stat.matchedCount == 0) {
      await Content.findByIdAndUpdate(
        post.series, {
          views: parseInt(series.views) + 1
        }, { new: true }
      );

      // const debit_coin = await Setting.findOne()
      const coins_transaction = {
        user:post.user,
        transaction_id: new Date().getTime(),
        type: 'debit',
        coin: debit_coin.coins_per_episode,
        message: 'Debit on view episodes'
      };
      await CoinTransaction.create(coins_transaction)

      await User.findByIdAndUpdate(
        req.user.id, {
          coins: user.coins - (debit_coin.coins_per_episode)
        }, { new: true }
      );

    }

    res.status(200).json({'status': true, 'message': 'view updated'});
    // res.status(201).json(user);
  } catch (err) {
    
    res.status(400).json({ error: err.message });
  }
});

// Read All
router.get('/', async (req, res) => {
  const users = await View.find();
  res.json(users);
});

// Read One
router.get('/:id', async (req, res) => {
  try {
    const user = await View.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'Banner not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const user = await View.findByIdAndUpdate(
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
    await View.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Banner deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
