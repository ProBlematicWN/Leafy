const fs = require('fs');
const path = require('path');


// Путь к файлу с предложениями
const filePath = path.join(__dirname, '..', 'src/data.log');

// Функция для получения случайного элемента из массива
function getRandomElement(array) {
    if (!array || array.length === 0) {
        return null;
    }
    return array[Math.floor(Math.random() * array.length)];
}

function getVladivostokTime() {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const vladivostokOffset = 10 * 60 * 60000; 
    const vladivostokTime = new Date(utcTime + vladivostokOffset);
    return vladivostokTime.toLocaleString('ru-RU', { timeZone: 'Asia/Vladivostok' });
}

// Основная функция для получения случайных слов
function getRandomWord(numWords = 1, retryOnError = true) {
    return new Promise((resolve, reject) => {
        // Чтение файла и обработка данных
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

            // Проверка, что в предложении достаточно слов
            if (words.length < numWords) {
                if (retryOnError) {
                    //console.warn(`В предложении недостаточно слов. Нужно ${numWords}, доступно ${words.length}. Пробуем снова...`);
                    // Рекурсивно вызываем функцию снова
                    resolve(getRandomWord(numWords, retryOnError));
                } else {
                    reject(`В предложении недостаточно слов. Нужно ${numWords}, доступно ${words.length}.`);
                }
                return;
            }

            // Выбор случайной начальной позиции
            const startIndex = Math.floor(Math.random() * (words.length - numWords + 1));

            // Выбор нескольких слов подряд
            const selectedWords = words.slice(startIndex, startIndex + numWords).join(' ');

            resolve(selectedWords);
        });
    });
}

module.exports = getVladivostokTime;
module.exports = getRandomWord;