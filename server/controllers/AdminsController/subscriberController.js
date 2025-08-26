const Subscriber = require('../../models/Subscriber');

// Create Subscriber
exports.createSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.create(req.body);
    res.status(201).json(subscriber);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Subscribers (with search + pagination + populated user/plan)
exports.getSubscribers = async (req, res) => {
  try {
    const searchText = req.query.search ?? '';
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset) || 0;

    const matchStage = {};

    if (searchText) {
      matchStage.$or = [
        { 'plan.title': { $regex: searchText, $options: 'i' } },
        { 'user.name': { $regex: searchText, $options: 'i' } },
      ];
    }

    const subscribersAgg = await Subscriber.aggregate([
      { $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $lookup: { from: 'plans', localField: 'plan_id', foreignField: '_id', as: 'plan' } },
      { $unwind: '$plan' },
      { $match: matchStage },
      { $sort: { created_at: -1 } },
      { $skip: offset },
      { $limit: limit },
    ]);

    const totalAgg = await Subscriber.aggregate([
      { $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $lookup: { from: 'plans', localField: 'plan_id', foreignField: '_id', as: 'plan' } },
      { $unwind: '$plan' },
      { $match: matchStage },
      { $count: 'total' },
    ]);

    const total = totalAgg[0]?.total || 0;

    res.json({
      status: true,
      message: 'Subscribers fetched successfully',
      data: subscribersAgg,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Error fetching subscribers: ', err);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

// Get One Subscriber
exports.getSubscriberById = async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) return res.status(404).json({ msg: 'Subscriber not found' });
    res.json(subscriber);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Subscriber
exports.updateSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(subscriber);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Subscriber
exports.deleteSubscriber = async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Subscriber deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
