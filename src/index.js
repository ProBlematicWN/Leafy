require('dotenv').config(); // create .env file with your tokens and other stuff
const { Client, IntentsBitField, AttachmentBuilder } = require('discord.js'); // discord library
const getVladivostokTime = require('./funcs'); // function to get local time (vladivostok one in my case)
const path = require('path'); 
const screenshotsDir = path.join(__dirname, 'screenshots'); // path for screenshots
const screenshot = require('screenshot-desktop'); // screenshot library
const getRandomWord = require('./funcs'); // yapping command function
const generate = require('./funcs');
const procc = require('./funcs');
//const { createCanvas, loadImage } = require('canvas');
const Canvas = require('@napi-rs/canvas');

var randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return keys[Math.round(Math.random() * keys.length - 1)]
};

var fs = require('fs');
dictionary = JSON.parse(fs.readFileSync('./src/data.json', 'utf8'))



let isFunctionEnabled = true; // true if you want to launch bot with acces to screenshot command

function getRandomInt() {
    return Math.floor(Math.random() * 10) + 1;
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

async function addTextToImage(text) {
    const canvas = Canvas.createCanvas(800, 600); // Укажите размеры холста
    const ctx = canvas.getContext('2d');
    randompic = Math.floor(Math.random() * 6) + 1;

    // Загрузите изображение
    const img = await Canvas.loadImage('./src/templates/' + randompic + `.png`);

    // Нарисуйте изображение на холсте
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Растягиваем изображение на весь холст

    // Настройки текста
    ctx.font = 'bold 70px Arial'; // Шрифт и размер
    ctx.fillStyle = 'white'; // Цвет текста
    ctx.textAlign = 'center'; // Выравнивание текста по центру

    // Позиция текста: посередине снизу
    var bottomOffset = 50
    const textX = canvas.width / 2; // Центр по горизонтали
    const textY = canvas.height - bottomOffset; // Отступ снизу

    // Добавьте текст на холст
    ctx.fillText(text, textX, textY);

    attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' });
    return attachment    
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
    "lordkekyshka",
]

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online`); // logging launch
});

client.on('messageCreate', (msg) => { // commands area, not the slash ones

    words = msg.content.replace(/<@([0-9])\w+>/,"").replace(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,"").replace(/[.,]/g, " ").replace(/\s+/g, " ").split(" ") //god forgive me for this line :pray:
    for(i = 0; i < words.length; i++){
        if(words[i+1]){  
            currentWord = words[i].toLowerCase();
            nextWord = words[i+1].toLowerCase();
            if(!Object.hasOwn(dictionary, currentWord)){
                dictionary[currentWord] = []
            }
            if(!dictionary[currentWord].includes(nextWord)){
                dictionary[currentWord].push(nextWord);
            }
        }
    }

    if ((msg.content != "Processing...") || (msg.author.username != "Leafy"))  { // avoid getting bot's replies in data file required for yapping command
            fs.appendFileSync('src/data.log', msg.content + `\n`);
        }

   // result.value = JSON.stringify(dictionary, undefined, " ")
    fs.writeFileSync('src/data.json', JSON.stringify(dictionary, undefined, " "))

    console.log(`${msg.author.username} - ${msg.content}`) // simple messages log in terminal
    fs.appendFileSync('src/debug.log', (`${msg.author.username} - ${msg.content}`)+`\n`); // logging in file

    if (msg.author.bot) { //check if message was sent by bot to avoid repeating to self 
        return;
    }

    if (msg.content === "") { // can't actually remember what is, too afraid to delete
        return;
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

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    console.log(`${interaction.user.username} issued command "${interaction.commandName}"`); // interactions logging

    if (interaction.commandName == 'test') { // simple test slash-command, you can use as template
       interaction.reply('test')
    }  
    
    if (interaction.commandName == 'yappic') {
    try {
        //var n = getRandomInt();
        var n = 1;

        words = []
        words[0] = randomProperty(dictionary)
        for(i = 0; i < n; i++){
            if(words[i].includes("<@")){
                continue
            }
            childWords = dictionary[words[words.length-1]]
            if(!childWords){
                console.log(words)
                break
            }
            words.push(childWords[Math.floor(Math.random() * childWords.length)]);
        }
        var imagetext = (words.join(" ").slice(0,2000))

        attachment = await addTextToImage(imagetext)

        interaction.reply({ files: [attachment] });
    } catch (error) {
        console.error(error)
    }
} 
    
    if (authorizedUsers.some(user => interaction.user.username.toLowerCase().includes(user.toLowerCase())) && interaction.commandName == 'yap') {
        
    //if ((interaction.commandName == 'yap') && (interaction.user.username == (('fijiwj') || ('16x9')))) {


        var n = interaction.options.get('word-amount')
        
        if (!n) {
           n = getRandomInt(); 
        }
        else {
            n = n.value
        }

        words = []
        words[0] = randomProperty(dictionary)
        for(i = 0; i < n; i++){
            if(words[i].includes("<@")){
                continue
            }
            childWords = dictionary[words[words.length-1]]
            if(!childWords){
                console.log(words)
                break
            }
            words.push(childWords[Math.floor(Math.random() * childWords.length)]);
        }
        interaction.reply(words.join(" ").slice(0,2000))
        }

    if (interaction.commandName == 'time') { // current time 
        const timestamp = Date.now();
        const slicetime = timestamp.toString().slice(0, 10);
        //interaction.reply(`сейчас у проба ${getVladivostokTime()}`) // previous version, doesn't work for me anymore (idk why)
        interaction.reply(`сейчас у проба <t:${slicetime}:f>`)
    }
    
    if (interaction.commandName == 'goon') { // goon
        goon(interaction)
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
        
            await interaction.reply('Processing...')

            await takeScreenshot(filename)
                .then(() => {
                    //interaction.reply({content: `${getVladivostokTime()}`, files: [filename] }) // old version
                    interaction.editReply({content: `<t:${slicetime}:f> `, files: [filename] })
                        .then(() => {
                            // fs.unlinkSync(filename); // delete "//" if you want to screenshot being deleted after using command
                        })
                        .catch((error) => {
                            console.error('Ошибка при отправке файла:', error);
                        });
                })
                .catch((error) => {
                    console.error('Ошибка при создании скриншота:', error);
                    interaction.editReply({ content: 'Произошла ошибка при создании скриншота!', flags: 64 }); // flags: 64 so this error message will see only the user, who issued command
                });
        }
        if (!isFunctionEnabled) {
           await interaction.reply('<:stop:1338512349455319111> Функция недоступна т.к. выключена ') // if toggle-screenshot turned off
        }
    }
})

client.login(process.env.TOKEN);
