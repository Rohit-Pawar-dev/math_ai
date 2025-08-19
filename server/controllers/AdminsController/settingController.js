const Setting = require("../../models/Setting");
const getCustomMulter = require('../../utils/customMulter');
const upload = getCustomMulter('logos');
// Create Setting
exports.createSetting = async (req, res) => {
  try {
    const setting = await Setting.create(req.body);
    res.status(201).json({
      status: true,
      message: "Setting created successfully",
      data: setting,
    });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

// Get All Settings
exports.getAllSettings = async (req, res) => {
  const users = await Setting.find()
  res.json(users)
};

// Get Setting by ID
exports.getSettingById = async (req, res) => {
  try {
    const setting = await Setting.findById(req.params.id);
    if (!setting) return res.status(404).json({ status: false, msg: "Setting not found" });

    res.json({ status: true, data: setting });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

// Update Setting (with optional app_logo upload)
exports.updateSetting = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.app_logo = `/uploads/logos/${req.file.filename}`;
    }

    const setting = await Setting.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!setting) return res.status(404).json({ status: false, msg: "Setting not found" });

    res.json({ status: true, message: "Setting updated successfully", data: setting });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

// Delete Setting
exports.deleteSetting = async (req, res) => {
  try {
    const setting = await Setting.findByIdAndDelete(req.params.id);
    if (!setting) return res.status(404).json({ status: false, msg: "Setting not found" });

    res.json({ status: true, message: "Setting deleted successfully" });
  } catch (err) {
    res.status(400).json({ status: false, error: err.message });
  }
};

exports.uploadLogoImage = upload.single('app_logo');