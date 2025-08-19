const User = require('../../models/User')
const nlogger = require('../../logger')
const getCustomMulter = require('../../utils/customMulter')
const upload = getCustomMulter('users')
const bcrypt = require('bcrypt')
const MEDIA_URL = process.env.MEDIA_URL

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

exports.uploadAdminImage = upload.single('profilePicture')
