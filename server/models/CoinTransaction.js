const mongoose = require('mongoose');
const { Schema } = mongoose;

const coinTransactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  transaction_id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'debit',
    enum: ['credit', 'debit']
  },
  coin: {
    type:Number
  },
  message: {
    type: String,
    default: "Debit on view Episode"
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('CoinTransaction', coinTransactionSchema);
