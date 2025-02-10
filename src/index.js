require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const getVladivostokTime = require('./funcs');
const path = require('path');
const screenshotsDir = path.join(__dirname, 'screenshots');
const screenshot = require('screenshot-desktop');
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

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online`);
});

client.on('messageCreate', (msg) => {
    console.log(`${msg.author.username} - ${msg.content}`)
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

    if (interaction.commandName === 'screenbread') {

        const timestamp = Date.now();
        const filename = path.join(screenshotsDir, `screenshot-${timestamp}.png`);

        takeScreenshot(filename)
            .then(() => {
                interaction.reply({content: `${getVladivostokTime()}`, files: [filename] })
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
})

client.login(process.env.TOKEN);