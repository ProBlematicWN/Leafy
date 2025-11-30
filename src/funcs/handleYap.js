const stats = require('./loadStats')
const saveStats = require('./saveStats');
const path = require('path'); 
const statsFile = path.join(__dirname, '..', 'stats.json');
const ranInt = require('./getRandomInt')
const ranProperty = require('./randomProperty')

// Экспортируем функцию
function handleYap(interaction, dictionary) {
    
    stats.yapped = (stats.yapped || 0) + 1;
    saveStats(stats());

    let n = interaction.options.get('word-amount');

    try {
        if (!n) {
            n = ranInt(); 
        } else {
            n = n.value;
        }

        let words = [];
        words[0] = ranProperty(dictionary);

        for (let i = 0; i < n; i++) {
            if (words[i].includes("<@")) {
                console.log(words);
                continue;
            }

            let childWords = dictionary[words[words.length - 1]];
            if (!childWords) {
                console.log(words);
                break;
            }

            words.push(childWords[Math.floor(Math.random() * childWords.length)]);
        }

        interaction.reply(words.join(" ").slice(0, 2000));
        console.log(`Команда была использована ${stats.yapped} раз(а)!`);
    } catch (error) {
        console.log(error);
    }
}

// Чтобы можно было использовать в других файлах
module.exports = handleYap;
