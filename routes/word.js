var express = require('express');
const { createWord, createQuiz, checkResultQuiz, getResult, importFile, exportFile } = require('../controller/word');
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
    .get('/export-csv', exportFile);

module.exports = router;