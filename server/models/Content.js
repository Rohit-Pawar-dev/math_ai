const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContentSchema = new Schema({
  type: { type: String, enum: ['movie', 'series', 'episode'], default:'series' },
  title: Object,
  description: Object,
  genres: [String],
  language: String,
  releaseDate: Date,
  thumbnailUrl: Object,
  videoUrl: Array,
  trailerUrl: Array,
  duration: Number,
  isPremium: { type: Boolean, default: false },

  // Series info
  seasonNumber: Number,
  episodeNumber: Number,

  // Views & Ratings
  rating: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  is_featured: { type: Number, enum: [0, 1], default: 0 },
  originals: { type: Number, enum: [0, 1], default: 0 },

  subtitles: Array,

  isDownloadable: { type: Boolean, default: false }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
}}
);

module.exports = mongoose.model('Content', ContentSchema);