const mongoose = require('mongoose');
const { Schema } = mongoose;

const reelSchema = new Schema({
  title: {
    type: Object,
    required: true
  },
  description: {
    type: Object,
    required: true
  },
  series: {
    type: Schema.Types.ObjectId,
    ref: 'Content',
    default: ""
  },
  video_link: {
    type:String,
    default:''
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive']
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('Reel', reelSchema);
