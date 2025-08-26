const mongoose = require('mongoose');
const { Schema } = mongoose;

const languageSchema = new Schema({
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
  is_active: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    default: 'active',
  },
  translations: {
    type: Object,
    default:{"hello":"Hello"}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Language', languageSchema);
