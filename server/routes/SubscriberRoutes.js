const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const User = require('../models/User');
const Subscriber = require('../models/Subscriber');
const auth = require('../middleware/authMiddleware');

// Create
router.post('/', async (req, res) => {
  try {
    var post = req.body;
    const user = await Subscriber.create(post);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read All
router.get('/', async (req, res) => {
  const users = await Subscriber.find().populate('user_id')  // populates full user details
                      .populate('plan_id');  // populates full plan details;
  res.json(users);
});

// Read One
router.get('/:id', async (req, res) => {
  try {
    const user = await Subscriber.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const user = await Subscriber.findByIdAndUpdate(
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
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Plan deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Purchase Plan
router.post('/purchase', auth, async (req, res) => {
  try {
    var post = req.body;

    const plan = await Plan.findById(post.plan_id);
    if (!plan) return res.status(404).json({ msg: 'Plan not found' });

    let expiry_date = new Date();
    if(plan.validity_type == 'year') {
      expiry_date.setFullYear(expiry_date.getFullYear() + parseInt(plan.validity_time));
    }

    var subscriberInfo = {
      user_id:req.user.id,
      plan_id: post.plan_id,
      transaction_id: post.transaction_id,
      payment_method: post.payment_method,
      amount: post.amount,
      is_auto_renew: post.is_auto_renew == 1 ? true : false,
      start_date: new Date(),
      end_date: expiry_date,
    };

    const subsc = await Subscriber.create(subscriberInfo);

    var subscription_details = {
      subscription : {
        planId: post.plan_id,
        startDate: new Date(),
        endDate: expiry_date,
        isAutoRenew: post.is_auto_renew == 1 ? true : false
      }
    }

    const updated_user = await User.findByIdAndUpdate(
      req.user.id, subscription_details, { new: true }
    );

    // const user = await Plan.create(post);
    res.status(201).json({status:true, message: 'plan purchased success'});
  } catch (err) {

    console.log('err ----------- ', err)

    res.status(400).json({status:true, message: err.message });
  }
});

module.exports = router;
