const Feedback = require("../../models/Feedback");

// Create feedback
exports.createFeedback = async (req, res) => {
  try {
    const user_id = req.user.id; // from auth
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ status: false, message: "Description is required" });
    }

    const feedback = await Feedback.create({ user_id, description });
    res.status(201).json({
      status: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Get all feedbacks of logged-in user
exports.getUserFeedbacks = async (req, res) => {
  try {
    const user_id = req.user.id;
    const feedbacks = await Feedback.find({ user_id }).sort({ createdAt: -1 });
    res.json({
      status: true,
      message: "User feedbacks fetched",
      data: feedbacks,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Get single feedback of logged-in user
exports.getUserFeedbackById = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const feedback = await Feedback.findOne({ _id: id, user_id });
    if (!feedback) {
      return res.status(404).json({ status: false, message: "Feedback not found or not authorized" });
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

// Update feedback (only by user who created it)
exports.updateUserFeedback = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const feedback = await Feedback.findOneAndUpdate(
      { _id: id, user_id },
      { description: req.body.description },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ status: false, message: "Feedback not found or not authorized" });
    }

    res.json({
      status: true,
      message: "Feedback updated successfully",
      data: feedback,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

// Delete feedback (only by user who created it)
exports.deleteUserFeedback = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const feedback = await Feedback.findOneAndDelete({ _id: id, user_id });
    if (!feedback) {
      return res.status(404).json({ status: false, message: "Feedback not found or not authorized" });
    }

    res.json({ status: true, message: "Feedback deleted successfully" });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};
