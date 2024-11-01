var express = require('express');
const { createWord, createQuiz, checkResultQuiz } = require('../controller/word');
var router = express.Router();

/* GET users listing. */
router
    .post('/', createWord)
    .get('/create-quiz', createQuiz)
    .post('/result-quiz', checkResultQuiz);

module.exports = router;