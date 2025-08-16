const mongoose = require('mongoose');
const { Schema } = mongoose;

const subscriberSchema = new Schema({
  user_id: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    default: ''
  },
  plan_id: {
    type: [Schema.Types.ObjectId],
    ref: 'Plan',
    default: ''
  },
  transaction_id: {
    type: String,
    required: [true],
    default:''
  },
  payment_method: {
    type: String,
    required: [true],
    default:''
  },
  amount: {
    type: String,
    required: [true],
  },
  is_auto_renew: {
    type: Boolean,
    required: [true],
    default:false
  },
  start_date: {
    type: String,
    required: [true],
    default:""
  },
  end_date: {
    type: String,
    required: [true],
    default:""
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive']
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('Subscriber', subscriberSchema);
