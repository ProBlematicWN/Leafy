const loadStats = require('./loadStats')
const saveStats = require('./saveStats');
const path = require('path'); 
const statsFile = path.join(__dirname, '..', 'stats.json');
const ranInt = require('./getRandomInt')
const ranProperty = require('./randomProperty')
const texttoimg = require('./addTextToImage')
const banwords = require('./loadBannedWords')


const stats = loadStats();

async function yappic(interaction, dictionary) {
    await interaction.reply('Processing...')
    // const stats = loadStats();
    stats.yapped = (stats.yapped || 0) + 1;
    saveStats(stats);

    try {
        //const bannedWords = loadBannedWords(); // грузим список из файла
        let imagetext = "";
        let attempts = 0;

        while (attempts < 10) {
            attempts++;

            let n = 1;
            let words = [];
            words[0] = ranProperty(dictionary);

            for (let i = 0; i < n; i++) {
                if (words[i].includes("<@")) {
                    continue;
                }
                let childWords = dictionary[words[words.length - 1]];
                if (!childWords) 
                    break;

                words.push(childWords[Math.floor(Math.random() * childWords.length)]);
            }

            imagetext = words.join(" ").slice(0, 2000);

            //проверка на бан-слова
            var hasBanned = banwords().some(w => imagetext.split(" ").includes(w));
            if (!hasBanned) {
                console.log(words)
                console.log(`passed`)
                break;
            }
            else {
                console.log(words)
                console.log(`banned`)
            }
        }

        const attachment = await texttoimg(imagetext); //await

        console.log(`Команда была использована ${stats.yapped} раз(а)!`);
        // await interaction.editReply(`total yapped ${stats.yapped} times`); //await
        // await interaction.editReply({ files: [attachment] }); //await

        await interaction.editReply({
            content: `total yapped ${stats.yapped} times`,
            files: [attachment]
        });


    } 
    catch (error) {
        console.error(error);
    }
}

module.exports = yappic;