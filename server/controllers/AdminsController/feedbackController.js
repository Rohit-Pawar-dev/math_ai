const Feedback = require("../../models/Feedback");

// Get All Feedbacks (with search + pagination)
exports.getAllFeedbacks = async (req, res) => {
  try {
    const searchText = req.query.search ?? '';
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset) || 0;

    const query = {};

    // Search by user name or email or feedback message
    if (searchText) {
      query.$or = [
        { message: { $regex: searchText, $options: 'i' } },
        { 'user_id.name': { $regex: searchText, $options: 'i' } },
        { 'user_id.email': { $regex: searchText, $options: 'i' } },
      ];
    }

    // Count total
    const total = await Feedback.countDocuments(query);

    // Fetch with pagination + populate user details
    const feedbacks = await Feedback.find(query)
      .populate('user_id', 'name email')
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      status: true,
      message: 'Feedbacks fetched successfully',
      data: feedbacks,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};


// Get single feedback
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate("user_id", "name email");
    if (!feedback) {
      return res.status(404).json({ status: false, message: "Feedback not found" });
    }
    res.json({
      status: true,
      message: "Feedback fetched successfully",
      data: feedback,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Respond/update feedback (admin can add response)
exports.respondFeedback = async (req, res) => {
  try {
    const { response } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { response },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ status: false, message: "Feedback not found" });
    }

    res.json({
      status: true,
      message: "Feedback responded successfully",
      data: feedback,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ status: false, message: "Feedback not found" });
    }
    res.json({ status: true, message: "Feedback deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
