const mongoose = require('mongoose');
const { Schema } = mongoose;

const mediaSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3
  },
  filename: {
    type: String,
    required: [true],
  },
  mimetype: {
    type: String,
    required: [true],
    default:"image/jpeg",
  },
  path:String,
  size:Number,
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

module.exports = mongoose.model('Media', mediaSchema);
