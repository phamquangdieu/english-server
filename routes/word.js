var express = require('express');
const { createWord, createQuiz, checkResultQuiz, getResult } = require('../controller/word');
var router = express.Router();

/* GET users listing. */
router
    .post('/', createWord)
    .get('/create-quiz', createQuiz)
    .post('/result-quiz', checkResultQuiz)
    .get('/get-result', getResult);

module.exports = router;