const Chapter = require('../../models/Chapter');

exports.createChapter = async (req, res) => {
  try {
    const { title, status } = req.body;
    let icon = null;

    if (req.file) {
      icon = req.file.path;
    }

    const chapter = new Chapter({
      title,
      icon,
      status
    });

    await chapter.save();
    res.status(201).json({
      status: true,
      message: "Chapter created successfully",
      data: chapter
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.getChapters = async (req, res) => {
  try {
    const searchText = req.query.search ?? '';
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const query = {};
    if (searchText) {
      query.title = { $regex: searchText, $options: 'i' };
    }

    const total = await Chapter.countDocuments(query);

    const chapters = await Chapter.find(query)
      .skip(offset)
      .limit(limit)
      .sort({ created_at: -1 });

    res.json({
      status: true,
      message: 'Chapters fetched successfully',
      data: chapters,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

exports.getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ status: false, message: "Chapter not found" });
    }
    res.json({
      status: true,
      message: "Chapter fetched successfully",
      data: chapter
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.updateChapter = async (req, res) => {
  try {
    const { title, status } = req.body;
    let updateData = { title, status };

    if (req.file) {
      updateData.icon = req.file.path;
    }

    const chapter = await Chapter.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!chapter) {
      return res.status(404).json({ status: false, message: "Chapter not found" });
    }

    res.json({
      status: true,
      message: "Chapter updated successfully",
      data: chapter
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.deleteChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndDelete(req.params.id);
    if (!chapter) {
      return res.status(404).json({ status: false, message: "Chapter not found" });
    }

    res.json({
      status: true,
      message: "Chapter deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
