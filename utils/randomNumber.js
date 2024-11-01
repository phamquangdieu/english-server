const randomNumber = (max) => {
    return Math.floor(Math.random() * max);
}

const randomArray = (source, count) => {
    let cloneSource = [...source];
    let arr = []
    for(let i = 0; i < count; i++ ) {
        let a = randomNumber(cloneSource.length);
        arr.push(cloneSource[a])
        cloneSource.splice(a, 1);
    }
    return arr;
}

const mapSelection = (arr, correct) => {
    let letters = ['A', 'B', 'C', 'D'];
    let cloneSource = [...arr, correct];
    let answers = {};
    let correctSelect;
    for (let i = 0; i < 4; i++) {
        let a = randomNumber(cloneSource.length);
        answers = {...answers, [letters[i]]: cloneSource[a]};
        if (cloneSource[a] === correct) {
            correctSelect = letters[i];
        }
        cloneSource.splice(a, 1);
    }
    return { answers, correctSelect };
}


module.exports = {
    randomNumber,
    randomArray,
    mapSelection
}