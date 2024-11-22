var express = require('express');
const { createWord, createQuiz, checkResultQuiz, getResult, importFile, exportFile, createQuiz2 } = require('../controller/word');
const multer = require('multer');
var router = express.Router();

var upload = multer({ dest: 'uploads/'});

/* GET users listing. */
router
    .post('/', createWord)
    .get('/create-quiz', createQuiz)
    .post('/result-quiz', checkResultQuiz)
    .get('/get-result', getResult)
    .post('/import-csv', upload.single('file'), importFile)
    .get('/export-csv', exportFile)
    .get('/create-quiz-2', createQuiz2);

module.exports = router;