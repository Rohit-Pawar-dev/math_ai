const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    icon: {
        type: String // URL or icon name
    },
   status: {
        type: String,
        enum: ['active', 'inactive', 'archived'],
        default: 'active'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chapter', ChapterSchema);
