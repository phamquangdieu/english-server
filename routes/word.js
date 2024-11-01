var express = require('express');
const { createWord, createQuiz, getResultQuiz } = require('../controller/word');
var router = express.Router();

/* GET users listing. */
router
    .post('/', createWord)
    .get('/create-quiz', createQuiz)
    .get('/result-quiz', getResultQuiz);

module.exports = router;