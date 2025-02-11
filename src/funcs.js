const fs = require('fs');
const path = require('path');


// path to your file with data for yapping command
const filePath = path.join(__dirname, '..', 'src/data.log');

// get random element
function getRandomElement(array) {
    if (!array || array.length === 0) {
        return null;
    }
    return array[Math.floor(Math.random() * array.length)];
}

function getVladivostokTime() { // get local time
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const vladivostokOffset = 10 * 60 * 60000; 
    const vladivostokTime = new Date(utcTime + vladivostokOffset);
    return vladivostokTime.toLocaleString('ru-RU', { timeZone: 'Asia/Vladivostok' });
}

// getting randow words
function getRandomWord(numWords = 1, retryOnError = true) {
    return new Promise((resolve, reject) => {
        // read file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject('Ошибка при чтении файла: ' + err);
                return;
            }

            if (!data || data.trim() === '') {
                reject('Файл пустой или содержит только пробелы.');
                return;
            }

            const sentences = data.split('\n').filter(line => line.trim() !== '');

            if (sentences.length === 0) {
                reject('Файл не содержит предложений.');
                return;
            }

            const randomSentence = getRandomElement(sentences);

            if (!randomSentence) {
                reject('Не удалось выбрать случайное предложение.');
                return;
            }

            const words = randomSentence.split(' ').filter(word => word.trim() !== '');

            if (words.length === 0) {
                reject('Случайное предложение не содержит слов.');
                return;
            }

            // check if enough words
            if (words.length < numWords) {
                if (retryOnError) { // retry if error
                    //console.warn(`В предложении недостаточно слов. Нужно ${numWords}, доступно ${words.length}. Пробуем снова...`); // remove "//" so it will send warning to console after every check
                    resolve(getRandomWord(numWords, retryOnError));
                } else {
                    reject(`В предложении недостаточно слов. Нужно ${numWords}, доступно ${words.length}.`);
                }
                return;
            }

            // choose random min number
            const startIndex = Math.floor(Math.random() * (words.length - numWords + 1));

            // choose couple words
            const selectedWords = words.slice(startIndex, startIndex + numWords).join(' ');

            resolve(selectedWords);
        });
    });
}



module.exports = getVladivostokTime;
module.exports = getRandomWord;