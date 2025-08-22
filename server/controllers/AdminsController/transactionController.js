const PlanTransaction = require('../../models/PlanTransaction');

// Get All Transactions
exports.getTransactions = async (req, res) => {
  try {
    const searchText = req.query.search ?? '';
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset) || 0;

    const matchStage = {};

    if (searchText) {
      matchStage.$or = [
        { transaction_id: { $regex: searchText, $options: 'i' } },
        { 'user.name': { $regex: searchText, $options: 'i' } },
        { 'plan.title': { $regex: searchText, $options: 'i' } },
      ];
    }

    // Fetch paginated transactions
    const transactionsAgg = await PlanTransaction.aggregate([
      { $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $lookup: { from: 'plans', localField: 'plan_id', foreignField: '_id', as: 'plan' } },
      { $unwind: '$plan' },
      { $match: matchStage },
      { $sort: { created_at: -1 } },
      { $skip: offset },
      { $limit: limit },
    ]);

    // Get total count
    const totalAgg = await PlanTransaction.aggregate([
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
      message: 'Transactions fetched successfully',
      data: transactionsAgg,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

