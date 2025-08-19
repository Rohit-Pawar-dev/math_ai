const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3
  },
  class: {
    type: String,
    required: false,
    default:''
  },
  description: {
    type: String,
    required: [true]
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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

module.exports = mongoose.model('Note', noteSchema);
