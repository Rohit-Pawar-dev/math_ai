const Subsection = require('../../models/SubSection');

exports.createSubsection = async (req, res) => {
  try {
    const { chapterId, topicId, sectionId, title, content, status } = req.body;

    const subsection = new Subsection({
      chapterId,
      topicId,
      sectionId,
      title,
      content,
      status
    });

    await subsection.save();

    res.status(201).json({
      status: true,
      message: "Subsection created successfully",
      data: subsection
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.getSubsections = async (req, res) => {
  try {
    const searchText = req.query.search ?? '';
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const query = {};
    if (searchText) {
      query.title = { $regex: searchText, $options: 'i' }; // Assuming 'title' exists in Subsection
    }

    const total = await Subsection.countDocuments(query);

    const subsections = await Subsection.find(query)
      .populate('chapterId', 'title')
      .populate('topicId', 'title')
      .populate('sectionId', 'title')
      .skip(offset)
      .limit(limit)
      .sort({ created_at: -1 }); // Change if needed

    res.json({
      status: true,
      message: 'Subsections fetched successfully',
      data: subsections,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

exports.getSubsectionById = async (req, res) => {
  try {
    const subsection = await Subsection.findById(req.params.id)
      .populate('chapterId', 'title')
      .populate('topicId', 'title')
      .populate('sectionId', 'title');

    if (!subsection) {
      return res.status(404).json({ status: false, message: "Subsection not found" });
    }

    res.json({
      status: true,
      message: "Subsection fetched successfully",
      data: subsection
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.updateSubsection = async (req, res) => {
  try {
    const { chapterId, topicId, sectionId, title, content, status } = req.body;

    const subsection = await Subsection.findByIdAndUpdate(
      req.params.id,
      { chapterId, topicId, sectionId, title, content, status },
      { new: true }
    )
      .populate('chapterId', 'title')
      .populate('topicId', 'title')
      .populate('sectionId', 'title');

    if (!subsection) {
      return res.status(404).json({ status: false, message: "Subsection not found" });
    }

    res.json({
      status: true,
      message: "Subsection updated successfully",
      data: subsection
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.deleteSubsection = async (req, res) => {
  try {
    const subsection = await Subsection.findByIdAndDelete(req.params.id);

    if (!subsection) {
      return res.status(404).json({ status: false, message: "Subsection not found" });
    }

    res.json({
      status: true,
      message: "Subsection deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
