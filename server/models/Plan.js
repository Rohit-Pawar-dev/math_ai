const mongoose = require('mongoose');
const { Schema } = mongoose;

const planSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3
  },
  description: {
    type: String,
    required: [true]
  },
  amount: {
    type: String,
    required: [true],
    default:'0'
  },
  discount: {
    type: String,
    required: [true],
    default:0
  },
  discount_type: {
    type: String,
    required: [true],
    default:'percent'
  },
  coins: {
    type: String,
    required: [true],
    default:'0'
  },
  validity_time: {
    type: String,
    required: [true],
    default:'5'
  },
  validity_type: {
    type: String,
    required: [true],
    default: 'day',
    enum:['day', 'week', 'month', 'year']
  },
  image: {
    type: String,
    default: ''
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

module.exports = mongoose.model('Plan', planSchema);
