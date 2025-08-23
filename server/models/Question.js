const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    optionType: {
        type: String,
        enum: ['text', 'image'],
        required: true
    },
    options: [
        {
            type: String,
            required: true
        }
    ],
    answer: {
        type: Number,
        required: true
    },
    explanationType: {
        type: String,
        enum: ['text', 'image']
    },
    explanation: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
});

module.exports = mongoose.model('Question', questionSchema);
