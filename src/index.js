require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const getVladivostokTime = require('./funcs');
const path = require('path');
const screenshotsDir = path.join(__dirname, 'screenshots');
const screenshot = require('screenshot-desktop');

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

let isFunctionEnabled = false;

//const fs = require('fs');

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

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online`);
});

client.on('messageCreate', (msg) => {
    const hasProb = msg.content.toLowerCase().includes("зкщи");
    console.log(`${msg.author.username} - ${msg.content}`)

    if (msg.author.bot) {
        return;
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
})

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    console.log(`${interaction.user.username} issued command "${interaction.commandName}"`);

    if (interaction.commandName == 'test') {
        interaction.reply('test')
    }

    if (interaction.commandName == 'time') {
        interaction.reply(`сейчас у проба ${getVladivostokTime()}`)
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