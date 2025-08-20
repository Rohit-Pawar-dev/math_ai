const User = require('../../models/User')
const nlogger = require('../../logger')
const getCustomMulter = require('../../utils/customMulter')
const upload = getCustomMulter('users')
const bcrypt = require('bcrypt')
const MEDIA_URL = process.env.MEDIA_URL

// Create user
exports.createUser = async (req, res) => {
  try {
    const { name, email, mobile, password, status, classStandard } = req.body

    // Check if user with same email or mobile already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    })

    if (existingUser) {
      let errorMessage = 'User already exists with '
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

    // Hash password before storing
    let hashedPassword = ''
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10)
      hashedPassword = await bcrypt.hash(password, salt)
    }

    // Create user
    const user = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword, 
      status,
      classStandard,
      profilePicture: req.file ? `/uploads/users/${req.file.filename}` : '',
    })

    res.status(201).json({
      status: true,
      message: 'User created successfully',
      data: user,
    })
  } catch (err) {
    nlogger.error('Create User Error: ' + err.message)
    res.status(500).json({ status: false, error: err.message })
  }
}


// Get all users with pagination + search

exports.getUsers = async (req, res) => {
  try {
    const searchText = req.query.search ?? ''
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset) || 0

    const query = {
      role: 'user',
      $or: [
        { name: { $regex: searchText, $options: 'i' } },
        { mobile: { $regex: searchText, $options: 'i' } },
        { email: { $regex: searchText, $options: 'i' } },
      ],
    }

    const total = await User.countDocuments(query)
    const users = await User.find(query).skip(offset).limit(limit).sort({ created_at: -1 })

    // Add full URL to profile picture
    const data = users.map((user) => ({
      ...user.toObject(),
      profilePicture: user.profilePicture ? `${MEDIA_URL}${user.profilePicture}` : null,
    }))

    res.json({
      status: true,
      message: 'Users fetched successfully',
      data,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    nlogger.error('Error retrieving users', err)
    res.status(500).json({ status: false, message: 'Internal server error' })
  }
}

exports.getTeachers = async (req, res) => {
  try {
    const searchText = req.query.search ?? ''
    const limit = parseInt(req.query.limit)
    const offset = parseInt(req.query.offset) || 0

    const query = {
      role: 'teacher',
      $or: [
        { name: { $regex: searchText, $options: 'i' } },
        { mobile: { $regex: searchText, $options: 'i' } },
        { email: { $regex: searchText, $options: 'i' } },
      ],
    }

    const total = await User.countDocuments(query)
    const users = await User.find(query).skip(offset).limit(limit).sort({ created_at: -1 })

    // Add full URL to profile picture
    const data = users.map((user) => ({
      ...user.toObject(),
      profilePicture: user.profilePicture ? `${MEDIA_URL}${user.profilePicture}` : null,
    }))

    res.json({
      status: true,
      message: 'Users fetched successfully',
      data,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    nlogger.error('Error retrieving users', err)
    res.status(500).json({ status: false, message: 'Internal server error' })
  }
}

// Get single user
exports.getUserById = async (req, res) => {
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

exports.updateUser = async (req, res) => {
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

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ msg: 'User deleted' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

exports.uploadProfile = async (req, res) => {
  try {
    const userId = req.body.userId
    const filePath = req.file.path

    await User.findByIdAndUpdate(userId, { profilePicture: filePath })

    res.status(200).json({ message: 'File uploaded successfully', filePath })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.uploadUserImage = upload.single('profilePicture')
