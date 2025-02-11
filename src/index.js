require('dotenv').config(); // create .env file with your tokens and other stuff
const { Client, IntentsBitField } = require('discord.js'); // discord library
const getVladivostokTime = require('./funcs'); // function to get local time (vladivostok one in my case)
const path = require('path'); 
const screenshotsDir = path.join(__dirname, 'screenshots'); // path for screenshots
const screenshot = require('screenshot-desktop'); // screenshot library
const getRandomWord = require('./funcs'); // yapping command function

var fs = require('fs');
let isFunctionEnabled = true; // true if you want to launch bot with acces to screenshot command

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }

function takeScreenshot(filename) {  // main screenshot function
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
        IntentsBitField.Flags.MessageContent, // some flags required for discord, these 4 should be enough, i guess
    ] 
});

const phrases = [ // "beggar" emoji reply trigger phrases
    "подарите мне",
    "подари мне",
    "купите мне",
    "купи мне",
];

const authorizedUsers = [ // users with special acces to some commands
    "fijiwj",
    "16x9",
]

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online`); // logging launch
});

client.on('messageCreate', (msg) => { // commands area, not the slash ones

    console.log(`${msg.author.username} - ${msg.content}`) // simple messages log in terminal
    fs.appendFileSync('src/debug.log', (`${msg.author.username} - ${msg.content}`)+`\n`); // logging in file

    if (msg.author.bot) { //check if message was sent by bot to avoid repeating to self 
        return;
    }

    if (msg.content === "") { // can't actually remember what is, too afraid to delete
        return;
    }

    if ((msg.content != "l.b") || (msg.author.username != "Leafy"))  { // avoid getting bot's replies in data file required for yapping command
        fs.appendFileSync('src/data.log', msg.content + `\n`);
    }

    if ((msg.content.toLowerCase().includes("кув")) && (msg.author.username === 'fijiwj')) { // ping with wrong layout
        msg.reply(process.env.RED_PING) 
    }

    if ((msg.content.toLowerCase().includes("@red")) && (msg.author.username === 'fijiwj')) { // ping with wrong layout
        msg.reply(process.env.RED_PING) 
    }
    
    if (phrases.some(phrase => msg.content.toLowerCase().includes(phrase.toLowerCase())) && msg.author.username === 'lordkekyshka') { // "beggar" reply feature
        msg.reply(process.env.BEGGAR);
    }

    if (authorizedUsers.some(user => msg.author.username.toLowerCase().includes(user.toLowerCase())) && msg.content.toLowerCase().includes("x.com")) { // converting to better x.com links with discord-supported embeds
        const xstart = (`https://fxtwitter`)
        msg.channel.send(msg.author.username + `: ` + xstart + `` + msg.content.slice(9))
        msg.delete(100)
    };

    if (authorizedUsers.some(user => msg.author.username.toLowerCase().includes(user.toLowerCase())) && msg.content.toLowerCase().includes("vt.tiktok.com")) { // converting to better tiktok links with discord-supported embeds
        const ttstart = (`https://tfx`)
        msg.channel.send(msg.author.username + `: ` + ttstart + `` + msg.content.slice(13)) // btw this one is for mobile links cuz of vt.
        msg.delete(100)
    };

    if (authorizedUsers.some(user => msg.author.username.toLowerCase().includes(user.toLowerCase())) && msg.content.toLowerCase().includes("tiktok.com")) { // converting to better tiktok links with discord-supported embeds
        if (msg.content.toLowerCase().includes("vt.tiktok.com")){ // check to avoid troubles with mobile links 
            return;
        }
        const ttstart = (`https://tfx`)
        msg.channel.send(msg.author.username + `: ` + ttstart + `` + msg.content.slice(14))
        msg.delete(100)
    };

//	if ((msg.content.toLowerCase().includes("vt.tiktok.com")) && (msg.author.username === 'fijiwj' )) { // previous version that will not delete your message
//        const ttstart = (`https://tfx`)
//        msg.channel.send(msg.author.username + `: ` + ttstart + `` + msg.content.slice(13))
//        msg.delete(100) 
//	}

//	if ((msg.content.toLowerCase().includes("x.com")) && (msg.author.username === 'fijiwj' )) { // previous version that will not delete your message
//        const xstart = (`https://fxtwitter`)
//        msg.channel.send(msg.author.username + `: ` + xstart + `` + msg.content.slice(9))
//        msg.delete(100)
//        }

})

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    console.log(`${interaction.user.username} issued command "${interaction.commandName}"`); // interactions logging

    if (interaction.commandName == 'test') { // simple test slash-command, you can use as template
        interaction.reply('test')
    }

    if (interaction.commandName == 'yap') { // yapping command
        const amount = interaction.options.get('amount').value
        if (amount > 6) {
            interaction.reply('слишком много слов выбрано')
            return;
        }
        getRandomWord(amount) // insert amount of words here (1 word as default)
            .then((words) => {
                interaction.reply(words);
            })
            .catch((error) => {
                console.error('Ошибка:', error);
            });
    }

    if (interaction.commandName == 'time') { // current time 
        const timestamp = Date.now();
        const slicetime = timestamp.toString().slice(0, 10);
        //interaction.reply(`сейчас у проба ${getVladivostokTime()}`) // previous version, doesn't work for me anymore (idk why)
        interaction.reply(`сейчас у проба <t:${slicetime}:f>`)
    }

    if (interaction.commandName == 'add') { // simple add command, use as template for interaction options
        const num1 = interaction.options.get('first-number').value
        const num2 = interaction.options.get('second-number').value
        interaction.reply(`The summ is ${num1 + num2}`)
    }

    if ((interaction.commandName == 'toggle-screenshot') && !(interaction.user.username === 'fijiwj')) { // toggle access to screenshot command
        interaction.reply(`<:stop:1338512349455319111> Недостаточно прав для выполнения этой функции`); // check for rights 
    }

    if ((interaction.commandName == 'toggle-screenshot') && (interaction.user.username === 'fijiwj')) { // toggle access to screenshot command
        isFunctionEnabled = !isFunctionEnabled;
        interaction.reply(`Функция ${isFunctionEnabled ? 'включена' : 'выключена'}.`);
    }

    if (interaction.commandName === 'screenbread') { // screenshot command
        if (isFunctionEnabled) {
            const timestamp = Date.now();
            const slicetime = timestamp.toString().slice(0, 10);
            const filename = path.join(screenshotsDir, `screenshot-${timestamp}.png`);
        
            takeScreenshot(filename)
                .then(() => {
                    //interaction.reply({content: `${getVladivostokTime()}`, files: [filename] }) // old version
                    interaction.reply({content: `<t:${slicetime}:f> `, files: [filename] })
                        .then(() => {
                            // fs.unlinkSync(filename); // delete "//" if you want to screenshot being deleted after using command
                        })
                        .catch((error) => {
                            console.error('Ошибка при отправке файла:', error);
                        });
                })
                .catch((error) => {
                    console.error('Ошибка при создании скриншота:', error);
                    interaction.reply({ content: 'Произошла ошибка при создании скриншота!', flags: 64 }); // flags: 64 so this error message will see only the user, who issued command
                });
        }
        if (!isFunctionEnabled) {
            interaction.reply('<:stop:1338512349455319111> Функция недоступна т.к. выключена ') // if toggle-screenshot turned off
        }
    }
})

client.login(process.env.TOKEN);
