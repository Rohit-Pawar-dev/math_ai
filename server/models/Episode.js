const mongoose = require('mongoose');
const { Schema } = mongoose;

const episodeSchema = new Schema({
  name: {
    type:String,
    default:""
  },
  episode_number: {
    type:Number,
    default:1
  },
  season_number: {
    type:Number,
    default:1
  },
  series: {
    type: Schema.Types.ObjectId,
    ref: 'Content'
  },
  url:{
    type:Object,
    default:{}
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive']
  },
  likes:{
    type: Number,
    default:0
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('Episode', episodeSchema);
