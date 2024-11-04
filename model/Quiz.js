const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        trim: true,
    },
    count: {
        type: Number
    }
    
}, {collection: 'Quizs'})

module.exports = mongoose.model('Quizs', QuizSchema)