const PlanTransaction = require('../../models/PlanTransaction');

// Get All Transactions
exports.getTransactions = async (req, res) => {
  try {
    const searchText = req.query.search ?? '';
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset) || 0;

    const query = {};

    if (searchText) {
      query.$or = [
        { transaction_id: { $regex: searchText, $options: 'i' } },
      ];
    }

    const total = await PlanTransaction.countDocuments(query);

    const transactions = await PlanTransaction.find(query)
      .populate('plan_id')
      .populate('user_id')
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      status: true,
      message: 'Transactions fetched successfully',
      data: transactions,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};
