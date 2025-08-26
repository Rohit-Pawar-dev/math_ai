const Section = require('../../models/Section');

exports.createSection = async (req, res) => {
  try {
    const { chapterId, topicId, title, status } = req.body;
    let video = null;

    if (req.file) {
      video = req.file.path;
    }

    const section = new Section({
      chapterId,
      topicId,
      title,
      video,
      status
    });

    await section.save();

    res.status(201).json({
      status: true,
      message: "Section created successfully",
      data: section
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.getSections = async (req, res) => {
  try {
    const searchText = req.query.search ?? '';
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const query = {};
    if (searchText) {
      query.title = { $regex: searchText, $options: 'i' }; 
    }

    const total = await Section.countDocuments(query);

    const sections = await Section.find(query)
      .populate('chapterId', 'title')
      .populate('topicId', 'title') 
      .skip(offset)
      .limit(limit)
      .sort({ created_at: -1 }); 

    res.json({
      status: true,
      message: 'Sections fetched successfully',
      data: sections,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

exports.getSectionById = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id)
      .populate('chapterId', 'title')
      .populate('topicId', 'title');

    if (!section) {
      return res.status(404).json({ status: false, message: "Section not found" });
    }

    res.json({
      status: true,
      message: "Section fetched successfully",
      data: section
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { chapterId, topicId, title, status } = req.body;
    let updateData = { chapterId, topicId, title, status };

    if (req.file) {
      updateData.video = req.file.path;
    }

    const section = await Section.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate('chapterId', 'title')
      .populate('topicId', 'title');

    if (!section) {
      return res.status(404).json({ status: false, message: "Section not found" });
    }

    res.json({
      status: true,
      message: "Section updated successfully",
      data: section
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);

    if (!section) {
      return res.status(404).json({ status: false, message: "Section not found" });
    }

    res.json({
      status: true,
      message: "Section deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
