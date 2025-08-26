const mongoose = require('mongoose');
const { Schema } = mongoose;

const calculatorSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3
  },
  description: {
    type: String,
    required: [true]
  },
  type: {
    type: String,
    required: [true]
  },
  link:{
    type: String,
    required: true,
    default: ''
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

module.exports = mongoose.model('Calculator', calculatorSchema);
