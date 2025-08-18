const mongoose = require('mongoose');
const { Schema } = mongoose;

const cheatsheetSchema = new Schema({
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
    default:'Algebra',
    enum: ['Algebra', 'Trigonometry', 'Limits', 'Derivatives', 'Integrals']
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

module.exports = mongoose.model('Cheatsheet', cheatsheetSchema);
