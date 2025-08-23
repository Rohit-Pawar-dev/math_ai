const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    answer: { type: String, required: true },
    explanation: { type: String },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    }
});


module.exports = mongoose.model('Question', questionSchema);
