const mongoose = require('mongoose');
const { Schema } = mongoose;

const viewSchema = new Schema({
  series: {
    type: Schema.Types.ObjectId,
    ref: 'Content',
    required:true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required:true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('View', viewSchema);
