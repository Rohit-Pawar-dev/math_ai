const mongoose = require('mongoose');
const { Schema } = mongoose;

const contentLanguageSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  display_name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-z]{2,3}$/ // Ex: EN, HI, EN-US
  },
  status: {
    type: String,
    default: 'active',
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ContentLanguage', contentLanguageSchema);
