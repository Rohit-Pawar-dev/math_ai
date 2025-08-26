const User = require('../../models/User')
const Notification = require('../../models/Notification');
const nlogger = require('../../logger')
const getCustomMulter = require('../../utils/customMulter')
const upload = getCustomMulter('users')
const notificationUpload = getCustomMulter('notifications');
const bcrypt = require('bcrypt')
const MEDIA_URL = process.env.MEDIA_URL
const sendNotification = require('../../utils/notification');

// Get single user
exports.getAdminById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('classStandard')
    if (!user) return res.status(404).json({ msg: 'User not found' })

    const userObj = user.toObject()
    userObj.profilePicture = user.profilePicture ? `${MEDIA_URL}${user.profilePicture}` : null

    res.json(userObj)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.updateAdmin = async (req, res) => {
  try {
    const userId = req.params.id
    const { name, email, mobile, status, password, classStandard } = req.body

    // Check for existing user with same email or mobile excluding current user
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
      _id: { $ne: userId },
    })

    if (existingUser) {
      let errorMessage = 'Another user already exists with '
      if (existingUser.email === email && existingUser.mobile === mobile) {
        errorMessage += 'this email and mobile number.'
      } else if (existingUser.email === email) {
        errorMessage += 'this email.'
      } else {
        errorMessage += 'this mobile number.'
      }

      return res.status(409).json({
        status: false,
        message: errorMessage,
      })
    }

    let updatedData = {
      name,
      email,
      mobile,
      status,
      classStandard,
    }

    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      updatedData.password = hashedPassword
    }

    if (req.file) {
      updatedData.profilePicture = `/uploads/users/${req.file.filename}`
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    })

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json({
      status: true,
      message: 'User updated successfully',
      data: updatedUser,
    })
  } catch (err) {
    nlogger.error('Update User Error: ' + err.message)
    res.status(400).json({ error: err.message })
  }
}

exports.uploadProfile = async (req, res) => {
  try {
    const { adminId } = req.body

    if (!adminId) {
      return res.status(400).json({ error: "Admin ID is required" })
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const filePath = `/uploads/users/${req.file.filename}`

    const updatedAdmin = await User.findByIdAndUpdate(
      adminId,
      { profilePicture: filePath },
      { new: true }
    )

    if (!updatedAdmin) {
      return res.status(404).json({ error: "Admin not found" })
    }

    res.status(200).json({
      status: true,
      message: "Profile image uploaded successfully",
      data: updatedAdmin,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


// Send Notification
exports.sendNotification = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file ? `/uploads/notifications/${req.file.filename}` : '';

    // 1. Save notification to DB
    const notification = await Notification.create({
      title,
      description,
      image,
    });

    // 2. Fetch all user FCM tokens
    const tokens = await User.find({ fcm_id: { $ne: null } }).select('fcm_id -_id');
    const fcmTokens = tokens.map((u) => u.fcm_id);

    // 3. Send notification
    await sendNotification(title, description, fcmTokens, image);

    res.status(201).json({
      status: true,
      message: 'Notification sent successfully',
      data: notification,
    });
  } catch (err) {
    console.error('Error sending:', err);
    res.status(500).json({ status: false, error: err.message });
  }
};

// get notifications
exports.getNotifications = async (req, res) => {
  try {
    const searchText = req.query.search ?? ''
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset) || 0

    const query = {}
    if (searchText) {
      query.title = { $regex: searchText, $options: 'i' } // searching by title
    }

    const total = await Notification.countDocuments(query)
    const notifications = await Notification.find(query)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })

    const data = notifications.map((notification) => ({
      ...notification.toObject(),
      image: notification.image ? `${MEDIA_URL}${notification.image}` : null,
    }))

    res.status(200).json({
      status: true,
      message: 'Notifications fetched successfully',
      data,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    res.status(500).json({ status: false, message: 'Internal server error' })
  }
}

// delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id

    const deletedNotification = await Notification.findByIdAndDelete(notificationId)

    if (!deletedNotification) {
      return res.status(404).json({ status: false, message: 'Notification not found' })
    }

    res.status(200).json({
      status: true,
      message: 'Notification deleted successfully',
    })
  } catch (err) {
    res.status(500).json({ status: false, message: 'Internal server error' })
  }
}



exports.uploadAdminImage = upload.single('profilePicture')
exports.uploadNotificationImage = notificationUpload.single('image');


