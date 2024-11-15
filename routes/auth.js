var express = require('express');
var router = express.Router();
const { handleUser } = require('../controller/user');

router.post('/google', handleUser);

module.exports = router;