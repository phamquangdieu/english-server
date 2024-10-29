var express = require('express');
const { createWord } = require('../controller/word');
var router = express.Router();

/* GET users listing. */
router.post('/', createWord);

module.exports = router;