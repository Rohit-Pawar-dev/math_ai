const Plan = require('../../models/Plan')

// Create Plan
exports.createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body)
    res.status(201).json(plan)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Get All Plans
exports.getPlans = async (req, res) => {
  try {
    const searchText = req.query.search ?? ''
    const limit = parseInt(req.query.limit) || 10
    const offset = parseInt(req.query.offset) || 0

    const query = {}
    if (searchText) {
      query.title = { $regex: searchText, $options: 'i' }
    }

    const total = await Plan.countDocuments(query)
    const plans = await Plan.find(query).skip(offset).limit(limit).sort({ created_at: -1 })

    res.json({
      status: true,
      message: 'Plans fetched successfully',
      data: plans,
      total,
      limit,
      offset,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    res.status(500).json({ status: false, message: 'Internal server error' })
  }
}

// Get Plan By ID
exports.getPlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id)
    if (!plan) return res.status(404).json({ msg: 'Plan not found' })
    res.json(plan)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Update Plan
exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(plan)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Delete Plan
exports.deletePlan = async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id)
    res.json({ msg: 'Plan deleted' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}
