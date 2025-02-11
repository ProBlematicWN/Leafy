require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const getVladivostokTime = require('./funcs');
const path = require('path');
const screenshotsDir = path.join(__dirname, 'screenshots');
const screenshot = require('screenshot-desktop');
const getRandomWord = require('./funcs');

var fs = require('fs');
let isFunctionEnabled = true;

//const fs = require('fs');

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }

function takeScreenshot(filename) {
    return new Promise((resolve, reject) => {
        screenshot({ filename: filename })
            .then(() => {
                console.log('Скриншот сохранен:', filename);
                resolve();
            })
            .catch((error) => {
                console.error('Ошибка при создании скриншота:', error);
                reject(error);
            });
    });
}

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

const phrases = [
    "подарите мне",
    "подари мне",
    "купите мне",
    "купи мне",
];

const authorizedUsers = [
    "fijiwj",
    "16x9",
]

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online`);
});

client.on('messageCreate', (msg) => {

    console.log(`${msg.author.username} - ${msg.content}`)
    fs.appendFileSync('src/debug.log', (`${msg.author.username} - ${msg.content}`)+`\n`);

    if (msg.author.bot) {
        return;
    }

    if (msg.content === "") {
        return;
    }

    if ((msg.content != "l.b") || (msg.author.username != "Leafy"))  {
        fs.appendFileSync('src/data.log', msg.content + `\n`);
    }

    if ((msg.content.toLowerCase().includes("кув")) && (msg.author.username === 'fijiwj')) {
        msg.reply(process.env.RED_PING) 
    }

    if ((msg.content.toLowerCase().includes("@red")) && (msg.author.username === 'fijiwj')) {
        msg.reply(process.env.RED_PING) 
    }
    
    if (phrases.some(phrase => msg.content.toLowerCase().includes(phrase.toLowerCase())) && msg.author.username === 'lordkekyshka') {
        msg.reply(process.env.BEGGAR);
    }

    if (authorizedUsers.some(user => msg.author.username.toLowerCase().includes(user.toLowerCase())) && msg.content.toLowerCase().includes("x.com")) {
        const xstart = (`https://fxtwitter`)
        msg.channel.send(msg.author.username + `: ` + xstart + `` + msg.content.slice(9))
        msg.delete(100)
    };

    if (authorizedUsers.some(user => msg.author.username.toLowerCase().includes(user.toLowerCase())) && msg.content.toLowerCase().includes("vt.tiktok.com")) {
        const ttstart = (`https://tfx`)
        msg.channel.send(msg.author.username + `: ` + ttstart + `` + msg.content.slice(13))
        msg.delete(100)
    };

    if (authorizedUsers.some(user => msg.author.username.toLowerCase().includes(user.toLowerCase())) && msg.content.toLowerCase().includes("tiktok.com")) {
        if (msg.content.toLowerCase().includes("vt.tiktok.com")){
            return;
        }
        const ttstart = (`https://tfx`)
        msg.channel.send(msg.author.username + `: ` + ttstart + `` + msg.content.slice(14))
        msg.delete(100)
    };

//	if ((msg.content.toLowerCase().includes("vt.tiktok.com")) && (msg.author.username === 'fijiwj' )) {
//        const ttstart = (`https://tfx`)
//        msg.channel.send(msg.author.username + `: ` + ttstart + `` + msg.content.slice(13))
//        msg.delete(100) 
//	}

//	if ((msg.content.toLowerCase().includes("x.com")) && (msg.author.username === 'fijiwj' )) {
//        const xstart = (`https://fxtwitter`)
//        msg.channel.send(msg.author.username + `: ` + xstart + `` + msg.content.slice(9))
//        msg.delete(100)
//        }

})

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    console.log(`${interaction.user.username} issued command "${interaction.commandName}"`);

    if (interaction.commandName == 'test') {
        interaction.reply('test')
    }

    if (interaction.commandName == 'yap') {
        const amount = interaction.options.get('amount').value
        if (amount > 6) {
            interaction.reply('слишком много слов выбрано')
            return;
        }
        getRandomWord(amount) // Укажите количество слов (по умолчанию 1)
            .then((words) => {
                interaction.reply(words);
            })
            .catch((error) => {
                console.error('Ошибка:', error);
            });
    }

    if (interaction.commandName == 'time') {
        const timestamp = Date.now();
        const slicetime = timestamp.toString().slice(0, 10);
        //interaction.reply(`сейчас у проба ${getVladivostokTime()}`)
        interaction.reply(`сейчас у проба <t:${slicetime}:f>`)
    }

    if (interaction.commandName == 'add') {
        const num1 = interaction.options.get('first-number').value
        const num2 = interaction.options.get('second-number').value
        interaction.reply(`The summ is ${num1 + num2}`)
    }

    if ((interaction.commandName == 'toggle-screenshot') && !(interaction.user.username === 'fijiwj')) {
        interaction.reply(`<:stop:1338512349455319111> Недостаточно прав для выполнения этой функции`);
    }

    if ((interaction.commandName == 'toggle-screenshot') && (interaction.user.username === 'fijiwj')) {
        isFunctionEnabled = !isFunctionEnabled;
        interaction.reply(`Функция ${isFunctionEnabled ? 'включена' : 'выключена'}.`);
    }

    if (interaction.commandName === 'screenbread') {
        if (isFunctionEnabled) {
            const timestamp = Date.now();
            const filename = path.join(screenshotsDir, `screenshot-${timestamp}.png`);
            const slicetime = timestamp.toString().slice(0, 10);
        
            takeScreenshot(filename)
                .then(() => {
                    //interaction.reply({content: `${getVladivostokTime()}`, files: [filename] })
                    interaction.reply({content: `<t:${slicetime}:f> `, files: [filename] })
                        .then(() => {
                            // fs.unlinkSync(filename);
                        })
                        .catch((error) => {
                            console.error('Ошибка при отправке файла:', error);
                        });
                })
                .catch((error) => {
                    console.error('Ошибка при создании скриншота:', error);
                    interaction.reply({ content: 'Произошла ошибка при создании скриншота!', flags: 64 });
                });
        }
        if (!isFunctionEnabled) {
            interaction.reply('<:stop:1338512349455319111> Функция недоступна т.к. выключена ')
        }
    }
})

client.login(process.env.TOKEN);
