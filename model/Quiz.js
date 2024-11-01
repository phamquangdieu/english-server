const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    
}, {collection: 'Quizs'})

module.exports = mongoose.model('Quizs', QuizSchema)