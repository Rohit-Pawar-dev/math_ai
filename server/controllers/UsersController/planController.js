const Plan = require('../../models/Plan')
const User = require('../../models/User')
const Subscriber = require('../../models/Subscriber')
const PlanTransaction = require('../../models/PlanTransaction')

// Plan List
exports.getPlans = async (req, res) => {
  try {
    // where status is active
    const plans = await Plan.find({ status: 'active' }).sort({ createdAt: -1 })
    res.status(200).json({ status: true, plans })
  } catch (err) {
    res.status(400).json({ status: false, message: err.message })
  }
}

// Purchase Plan
exports.purchasePlan = async (req, res) => {
  try {
    const post = req.body
    console.log('post', post);
    
    const plan = await Plan.findById(post.plan_id)
    if (!plan) return res.status(404).json({ msg: 'Plan not found' })

    let expiry_date = new Date()
    if (plan.validity_type === 'year') {
      expiry_date.setFullYear(expiry_date.getFullYear() + parseInt(plan.validity_time))
    }

    const subscriberInfo = {
      user_id: req.user.id,
      plan_id: post.plan_id,
      transaction_id: post.transaction_id,
      payment_method: post.payment_method,
      amount: post.amount,
      is_auto_renew: post.is_auto_renew == 1,
      start_date: new Date(),
      end_date: expiry_date,
    }
    await Subscriber.create(subscriberInfo)

    await PlanTransaction.create({
      user_id: req.user.id,
      plan_id: post.plan_id,
      transaction_id: post.transaction_id,
      payment_method: post.payment_method,
      amount: post.amount,
      status: 'success',
    })

    await User.findByIdAndUpdate(
      req.user.id,
      {
        subscription: {
          planId: post.plan_id,
          startDate: new Date(),
          endDate: expiry_date,
          isAutoRenew: post.is_auto_renew == 1,
        },
      },
      { new: true }
    )

    res.status(201).json({ status: true, message: 'Plan purchased successfully' })
  } catch (err) {
    res.status(400).json({ status: false, message: err.message })
  }
}
