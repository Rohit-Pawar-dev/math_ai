const Class = require('../../models/Class')

// Add or Update class
exports.createOrUpdateClass = async (req, res) => {
  try {
    const { _id, name, description, status } = req.body

    // Check duplicate name (case-insensitive)
    const existing = await Class.findOne({
      name: { $regex: `^${name}$`, $options: 'i' },
      ...(!!_id ? { _id: { $ne: _id } } : {}), 
    })

    if (existing) {
      return res.status(400).json({
        status: 'error',
        message: 'Class name already exists',
      })
    }

    let classDoc
    if (_id) {
      // Update existing
      classDoc = await Class.findByIdAndUpdate(_id, { name, description, status }, { new: true })
      if (!classDoc) {
        return res.status(404).json({
          status: 'error',
          message: 'Class not found',
        })
      }
      return res.json({
        status: 'success',
        message: 'Class updated successfully',
        data: classDoc,
      })
    } else {
      // Create new
      classDoc = new Class({ name, description, status })
      await classDoc.save()
      return res.json({
        status: 'success',
        message: 'Class created successfully',
        data: classDoc,
      })
    }
  } catch (err) {
    console.error('Error in createOrUpdateClass:', err)
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    })
  }
}

// Get All with filters and pagination
exports.getAllClasses = async (req, res) => {
  try {
    const { search = '', status } = req.query
    const limit = parseInt(req.query.limit) || 10
    const offset = parseInt(req.query.offset) || 0

    const filter = {
      ...(status ? { status } : {}), 
      name: { $regex: search, $options: 'i' },
    }

    const total = await Class.countDocuments(filter)

    const classes = await Class.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit).sort({ created_at: -1 });

    res.json({
      status: true,
      message: 'Classes fetched successfully',
      data: classes,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error('Error fetching classes:', err)
    res.status(500).json({ status: false, message: 'Internal server error' })
  }
}

// Get One
exports.getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
    if (!classData) return res.status(404).json({ msg: 'Class not found' })
    res.json(classData)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Delete
exports.deleteClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndDelete(req.params.id)
    if (!classData) return res.status(404).json({ msg: 'Class not found' })

    res.json({ msg: 'Class deleted' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}
