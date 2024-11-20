const { map, size, filter } = require('lodash');
const Word = require('../model/Word');
const { randomNumber, randomArray, mapSelection } = require('../utils/randomNumber');
const Quiz = require('../model/Quiz');
const fs = require('fs');
const csvParser = require('csv-parser');
const path = require('path');
const { writeToPath } = require('fast-csv');

const correctAnswerArr = {
    'en': 'mean',
    'vi': 'word',
    'synonym': 'synonym'
};

const createWord = async function(req, res, next) {
    const word = await Word.create(req.body);
    res.status(200).json(word);
};

const createQuiz = async function(req, res, next) {
    try {
        const wordList = await Word.aggregate([
            { $sample: { size: 30 } }
          ]);
        const words = map(wordList, 'word');
        const means = map(wordList, 'mean');
        const answersQuiz = [];
        const quiz = map([...wordList].slice(0, 15), (item, key) => {
            let type = randomNumber(2) === 0 ? 'en' : 'vi';
            if (item.synonym) type = 'synonym';
            let word = type === 'en' || type === 'synonym' ? item.word : item.mean;
            let correctAnswer = item[correctAnswerArr[type]];
            let tmpSelections = type === 'en'
                ? randomArray(filter(means, i => i !== item.mean), 3)
                : randomArray(filter(words, i => i !== item.word), 3);
            let {  answers, correctSelect } = mapSelection(tmpSelections, correctAnswer);
            
            answersQuiz.push({
                key,
                correctSelect, 
                type,
                word,
                answers,
                synonym: !!item.synonym
            });
            return ({
                key,
                type,
                word,
                answers,
                synonym: !!item.synonym
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
    const response = await Quiz.findById(id);
    res.status(200).json({ result: response });
};

const exportFile = async function(req, res, next) {
    try {
        const all = await Word.find({});
        const filePath = path.join(__dirname, '../public/demo-1.csv');
        const data = map(all, item => ({ word: item.word, mean: item.mean }));

        
        writeToPath(filePath, data, { headers: true })
            .on('error', (err) => {
                console.error(err);
                res.status(500).send('Error creating CSV file');
            })
            .on('finish', () => {
                res.download(filePath, 'data.csv', (err) => {
                    if (err) console.error(err);
                    // fs.unlinkSync(filePath); // Xoá file sau khi tải xong
                });
            });
    } catch (error) {
        res.status(500).json({ error });
    }
};

const importFile = async function(req, res, next) {
    try {
        const { level } = req.body;
        const filePath = req.file.path;
        var results = [];
        let subCategory = 'word';
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (result) => {
                if (!result.mean) {
                    subCategory = result.word; 
                }
                if (result?.word && result?.mean) {
                    results.push({
                        mean: result.mean,
                        word: result.word,
                        author: req.user.email,
                        synonym: result?.synonym,
                        category: result?.category,
                        level,
                        subCategory
                    });
                }
            })
            .on('end', async () => {
                fs.unlink(filePath, error => {
                    if (error) {
                        console.log(123, error);
                    }
                });
                await Word.insertMany(results);
            })
            .on('error', (error) => console.log(1234, error)
            );
        
        res.status(200).json({ success: 'done'});
    } catch (error) {
        res.status(500).json({ error });
    }
};

module.exports = {
    createWord,
    createQuiz,
    checkResultQuiz,
    getResult,
    importFile,
    exportFile,
};
