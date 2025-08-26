const mongoose = require('mongoose');

const { Schema } = mongoose;

const planTransactionSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan_id: {
      type: Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    transaction_id: {
      type: String,
      required: true,
      unique: true,
    },
    payment_method: {
      type: String,
      required: true,
      enum: ['upi', 'card', 'netbanking', 'wallet', 'cash', 'Razorpay'], 
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'success',
      enum: ['success', 'pending', 'failed'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

module.exports = mongoose.model('PlanTransaction', planTransactionSchema);
