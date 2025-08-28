const mongoose = require('mongoose');
const { Schema } = mongoose;

const quizAttemptSchema = new Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  answers: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
      },
      selectedOption: {
        type: Number,
        required: true
      },
      isCorrect: {
        type: Boolean
      }
    }
  ],
  status: {
    type: String,
    enum: ['in_progress', 'completed'],
    default: 'in_progress'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
