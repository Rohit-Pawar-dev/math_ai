const mongoose = require('mongoose');
const { Schema } = mongoose;

const genreSchema = new Schema({
  display_name:{
    type:String,
    required:true
  },
  title: {
    type: Object,
    required: true
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

module.exports = mongoose.model('Genre', genreSchema);
