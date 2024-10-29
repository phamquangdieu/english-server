const mongoose = require('mongoose');

const WordSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        trim: true,
    },
    mean: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    
}, {collection: 'Words'})

module.exports = mongoose.model('Word', WordSchema)