const User = require('../../models/User');
const nlogger = require('../../logger');
const getCustomMulter = require('../../utils/customMulter');
const upload = getCustomMulter('users');
const bcrypt = require('bcrypt');
const MEDIA_URL = process.env.MEDIA_URL;

// Get single teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id).populate('classStandard');
    if (!teacher) {
      return res.status(404).json({
        status: false,
        message: 'Teacher not found',
      });
    }

    const teacherObj = teacher.toObject();
    teacherObj.profilePicture = teacher.profilePicture
      ? `${MEDIA_URL}${teacher.profilePicture}`
      : null;

    res.status(200).json({
      status: true,
      message: 'Teacher retrieved successfully',
      data: teacherObj,
    });
  } catch (err) {
    nlogger.error('Get Teacher Error:', err);
    res.status(500).json({
      status: false,
      message: 'Failed to retrieve teacher',
      error: err.message,
    });
  }
};

// Update teacher details
exports.updateTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const { name, email, mobile, status, password, classStandard } = req.body;

    // Validate inputs
    if (!name || !email || !mobile) {
      return res.status(400).json({
        status: false,
        message: 'Name, email, and mobile are required',
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
      _id: { $ne: teacherId },
    });

    if (existingUser) {
      let errorMessage = 'Another user already exists with ';
      if (existingUser.email === email && existingUser.mobile === mobile) {
        errorMessage += 'this email and mobile number.';
      } else if (existingUser.email === email) {
        errorMessage += 'this email.';
      } else {
        errorMessage += 'this mobile number.';
      }

      return res.status(409).json({
        status: false,
        message: errorMessage,
      });
    }

    const updatedData = {
      name,
      email,
      mobile,
      status,
      classStandard,
    };

    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedData.password = hashedPassword;
    }

    if (req.file) {
      updatedData.profilePicture = `/uploads/users/${req.file.filename}`;
    }

    const updatedTeacher = await User.findByIdAndUpdate(teacherId, updatedData, {
      new: true,
    });

    if (!updatedTeacher) {
      return res.status(404).json({
        status: false,
        message: 'Teacher not found',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Teacher updated successfully',
      data: updatedTeacher,
    });
  } catch (err) {
    nlogger.error('Update Teacher Error:', err);
    res.status(500).json({
      status: false,
      message: 'Failed to update teacher',
      error: err.message,
    });
  }
};

// Middleware to handle image upload
exports.uploadTeacherImage = upload.single('profilePicture');

// Save uploaded teacher profile image
exports.uploadProfile = async (req, res) => {
  try {
    const { teacherId } = req.body;

    if (!teacherId) {
      return res.status(400).json({
        status: false,
        message: 'Teacher ID is required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: 'No file uploaded',
      });
    }

    const filePath = `/uploads/users/${req.file.filename}`;

    const updatedTeacher = await User.findByIdAndUpdate(
      teacherId,
      { profilePicture: filePath },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({
        status: false,
        message: 'Teacher not found',
      });
    }

    res.status(200).json({
      status: true,
      message: 'Profile image uploaded successfully',
      data: updatedTeacher,
    });
  } catch (err) {
    nlogger.error('Upload Teacher Image Error:', err);
    res.status(500).json({
      status: false,
      message: 'Failed to upload profile image',
      error: err.message,
    });
  }
};
