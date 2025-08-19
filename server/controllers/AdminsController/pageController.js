const Page = require("../../models/Page");

// Create Page
exports.createPage = async (req, res) => {
  try {
    const page = await Page.create(req.body);
    res.status(201).json({
      status: true,
      message: "Page created successfully",
      data: page,
    });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

// Get All Pages
exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.find();
    res.json({
      status: true,
      total: pages.length,
      data: pages,
    });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

// Get Page by ID
exports.getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ status: false, msg: "Page not found" });

    res.json({ status: true, data: page });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

// Get Page by Slug
exports.getPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ status: false, msg: "Page not found" });

    res.json({ status: true, data: page });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

// Update Page
exports.updatePage = async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!page) return res.status(404).json({ status: false, msg: "Page not found" });

    res.json({ status: true, message: "Page updated successfully", data: page });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

// Delete Page
exports.deletePage = async (req, res) => {
  try {
    const page = await Page.findByIdAndDelete(req.params.id);
    if (!page) return res.status(404).json({ status: false, msg: "Page not found" });

    res.json({ status: true, message: "Page deleted successfully" });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};
