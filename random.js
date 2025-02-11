const fs = require('fs');
const path = require('path');

// Путь к файлу с предложениями
const filePath = path.join(__dirname, 'data.log');

// Функция для получения случайного элемента из массива
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Чтение файла и обработка данных
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Ошибка при чтении файла:', err);
        return;
    }

    // Разделение содержимого файла на предложения по строкам
    const sentences = data.split('\n').filter(line => line.trim() !== '');

    // Выбор случайного предложения
    const randomSentence = getRandomElement(sentences);

    // Разделение предложения на слова
    const words = randomSentence.split(' ').filter(word => word.trim() !== '');

    // Выбор случайного слова
    const randomWord = getRandomElement(words);

    // Вывод случайного слова в консоль
    console.log('Случайное слово:', randomWord);
});