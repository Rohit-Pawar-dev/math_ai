const mongoose = require('mongoose');
const { Schema } = mongoose;

const quizSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3
  },
  description: {
    type: String,
    required: [true]
  },
  is_paid: {
    type: Boolean,
    default: false
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  amount: {
    type: String,
    required: [true],
    default: '0'
  },
  image: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive']
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    }
  ]
  ,
  uniqueCode: {
    type: String,
    unique: true,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('Quiz', quizSchema);
