const { map, size, filter } = require('lodash');
const Word = require('../model/Word');
const { randomNumber, randomArray, mapSelection } = require('../utils/randomNumber');
const Quiz = require('../model/Quiz');

const createWord = async function(req, res, next) {
    const word = await Word.create(req.body);
    res.status(200).json(word);
};

const createQuiz = async function(req, res, next) {
    console.log(123);
    try {
        const wordList = await Word.aggregate([
            { $sample: { size: 30 } }
          ]);
        const words = map(wordList, 'word');
        const means = map(wordList, 'mean');
        const answersQuiz = [];
        const quiz = map([...wordList].slice(0, 15), (item, key) => {
            let type = randomNumber(2) === 0 ? 'en' : 'vi';
            let word = type === 'en' ? item.word : item.mean;
            let correctAnswer = type === 'en' ? item.mean : item.word;
            let tmpSelections = type === 'en' 
                ? randomArray(filter(means, i => i !== item.mean), 3)
                : randomArray(filter(words, i => i !== item.word), 3);
            let {  answers, correctSelect } = mapSelection(tmpSelections, correctAnswer);
            answersQuiz.push({
                key,
                correctSelect, 
                type,
                word,
                answers
            });
            return ({
                key,
                type,
                word,
                answers
            });
        });
        const createdQuiz = await Quiz.create({ content: answersQuiz });
        res.status(200).json({
            id: createdQuiz._id,
            content: quiz,
        });
    } catch (error) {
        console.log(error);
    }
};

const checkResultQuiz = async function(req, res, next) {
    const { id, answers } = req.body;
    const tmp = await Quiz.findById(id);
    const result = tmp.content;
    let count = 0;
    const handleResult = map(result, item => {
        if (answers[item.key.toString()] === item.correctSelect) count++;
        return {
            ...item,
            yourChoice: answers[item.key.toString()]
        };
    });
    await Quiz.findOneAndUpdate({ _id: id }, { count, content: handleResult });
    res.status(200).json({
        id,
        correct: count,
        result: handleResult,
    });
};

const getResult = async function(req, res, next) {
    const { id } = req.query;
    console.log(id);
    const response = await Quiz.findById(id);
    res.status(200).json({ result: response });
};

module.exports = {
    createWord,
    createQuiz,
    checkResultQuiz,
    getResult,
};
