const mongoose = require('mongoose');
const { Schema } = mongoose;

const bannerSchema = new Schema({
  title: {
    type: Object,
    required: true
  },
  image: {
    type: Object,
    required: true
  },
  series: {
    type: [Schema.Types.ObjectId],
    ref: 'Content',
    default: []
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive']
  },
  type: {
    type: String,
    default: 'latest',
    enum: ['latest', 'featured', 'most-views', 'custom']
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('Banner', bannerSchema);
