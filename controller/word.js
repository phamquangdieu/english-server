const Word = require("../model/Word")

const createWord = async function(req, res, next) {
    console.log(req.body);
    const word = await Word.create(req.body);
    res.status(200).json(word);
}

module.exports = {
    createWord
}
