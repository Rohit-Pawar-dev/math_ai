const mongoose = require('mongoose');
const { Schema } = mongoose;

const homeScreenSchema = new Schema({
  title: {
    type: Object,
    required: true
  },
  series: {
    type: [Schema.Types.ObjectId],
    ref: 'Content',
    default: []
  },
  priority: {
    type: Number,
    default: '0'
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive']
  },
  type: {
    type: String,
    default: 'latest',
    enum: ['latest', 'featured', 'trending', 'custom']
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('HomeApp', homeScreenSchema);
