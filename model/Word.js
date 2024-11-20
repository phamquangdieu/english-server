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
        trim: true,
        required: true,
    },
    createdTime: {
        type : Date,
        default: Date.now,
        required: true,
    },
    level: {
        type: String,
    },
    category: {
        type: String
    },
    subCategory: {
        type: String
    },
    synonym: {
        type: String
    }
}, {collection: 'Words'});

module.exports = mongoose.model('Word', WordSchema);