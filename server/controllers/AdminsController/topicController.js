const Topic = require('../../models/Topic');

exports.createTopic = async (req, res) => {
  try {
    const { chapterId, title, description, status } = req.body;

    const topic = new Topic({
      chapterId,
      title,
      description,
      status
    });
    await topic.save();
    res.status(201).json({
      status: true,
      message: "Topic created successfully",
      data: topic
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.getTopics = async (req, res) => {
  try {
    const searchText = req.query.search ?? '';
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const query = {};
    if (searchText.trim() !== '') {
      query.title = { $regex: searchText, $options: 'i' };
    }
    const total = await Topic.countDocuments(query);

    const topics = await Topic.find(query)
      .populate('chapterId', 'title')
      .skip(offset)
      .limit(limit)
      .sort({ timestamp: -1 });

    res.json({
      status: true,
      message: 'Topics fetched successfully',
      data: topics,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

exports.getTopicById = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate('chapterId', 'title');
    if (!topic) {
      return res.status(404).json({ status: false, message: "Topic not found" });
    }
    res.json({
      status: true,
      message: "Topic fetched successfully",
      data: topic
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const { chapterId, title, description, status } = req.body;

    const topic = await Topic.findByIdAndUpdate(
      req.params.id,
      { chapterId, title, description, status },
      { new: true }
    ).populate('chapterId', 'title');

    if (!topic) {
      return res.status(404).json({ status: false, message: "Topic not found" });
    }

    res.json({
      status: true,
      message: "Topic updated successfully",
      data: topic
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) {
      return res.status(404).json({ status: false, message: "Topic not found" });
    }

    res.json({
      status: true,
      message: "Topic deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
