const { map, size, filter } = require("lodash");
const Word = require("../model/Word");
const { randomNumber, randomArray, mapSelection } = require("../utils/randomNumber");
const Quiz = require("../model/Quiz");

const createWord = async function(req, res, next) {
    const word = await Word.create(req.body);
    res.status(200).json(word);
}

const createQuiz = async function(req, res, next) {
    const wordList = await Word.aggregate([
        { $sample: { size: 10 } }
      ])
    const words = map(wordList, 'word');
    const means = map(wordList, 'mean');
    const answersQuiz = []
    const quiz = map(wordList, (item, key) => {
        let type = randomNumber(2) === 0 ? 'en' : 'vi';
        let word = type === 'en' ? item.word : item.mean;
        let correctAnswer = type === 'en' ? item.mean : item.word;
        let tmpSelections = type === 'en' 
            ? randomArray(filter(means, i => i !== item.mean), 3)
            : randomArray(filter(words, i => i !== item.word), 3);
        let {  answers, correctSelect} = mapSelection(tmpSelections, correctAnswer);
        answersQuiz.push({ key, correctSelect })
        return ({
            key,
            type,
            word,
            answers
        })
    })
    const createdQuiz = await Quiz.create({ content: JSON.stringify(answersQuiz) });
    res.status(200).json({
        id: createdQuiz._id,
        content: quiz,
    });
}

const getResultQuiz = async function(req, res, next) {
    const { id } = req.query;
    const tmp = await Quiz.findById(id);
    const result = JSON.parse(tmp.content);
    res.status(200).json(result);
}

module.exports = {
    createWord,
    createQuiz,
    getResultQuiz
}
