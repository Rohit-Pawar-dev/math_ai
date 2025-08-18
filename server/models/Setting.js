const mongoose = require('mongoose')

const appConfigSchema = new mongoose.Schema(
  {
    app_name: {
      type: String,
      required: true,
      trim: true,
    },
    app_email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    app_mobile: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, // Basic 10-digit validation
    },
    app_detail: {
      type: String,
      default: '',
    },
    app_languages: {
      type: Array,
      default: [],
    },
    free_episodes: {
      type: Number,
      default: 10,
    },
    coins_per_episode: {
      type: Number,
      default: 0,
    },
    refer_n_earn_coins: {
      type: Number,
      default: 10,
    },
    app_logo: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  },
)

module.exports = mongoose.model('Setting', appConfigSchema)
