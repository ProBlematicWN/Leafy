require('dotenv').config(); // create .env file with your tokens and other stuff
const { Client, IntentsBitField, AttachmentBuilder } = require('discord.js'); // discord library
const getVladivostokTime = require('./funcs'); // function to get local time (vladivostok one in my case)
const path = require('path'); 
const screenshotsDir = path.join(__dirname, 'screenshots'); // path for screenshots
const screenshot = require('screenshot-desktop'); // screenshot library
const getRandomWord = require('./funcs'); // yapping command function
const generate = require('./funcs');
const procc = require('./funcs');
const stats = require('./funcs/loadStats')
//const { createCanvas, loadImage } = require('canvas');
const handleYap = require('./funcs/handleYap'); // подключаем
const yappic = require('./funcs/yappic')
const ranYap = require('./funcs/ranYap')
const respondChance = require('./funcs/chance')
const statsFile = path.join(__dirname, 'stats.json');
const { execFile } = require('child_process');
// const voiceLogPath = "C:\\Users\\assas\\Desktop\\some_projects\\discord_voice_graphs\\logs\\day.log"
const voiceLogPath = process.env.VOICELOGPATH


const gradeEmojis = {
  brilliant: '1398915810545766460',
  bestMove:  '1398915779088617614',
  greatMove: '1398915794460737596',
  excellent: '1398915762642747484',
  good: '1398915746666512415',
  book: '1398915730547937331',
  inaccuracy:'1398915714131300353',
  mistake:   '1398915698763370516',
  blunder:   '1398915682812563496',
  miss: '1398915664584118342',
};

const images = [
  path.join(__dirname, 'images', 'lie.png'),
  path.join(__dirname, 'images', 'true.png')
];

var fs = require('fs');
dictionary = JSON.parse(fs.readFileSync('./src/data.json', 'utf8'))

let isFunctionEnabled = false; // true if you want to launch bot with access to screenshot command

function getTrueFalse() {
    return Math.floor(Math.random() * 2) + 1;
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
        IntentsBitField.Flags.GuildVoiceStates,
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


const { PresenceUpdateStatus } = require('discord.js');
const { ActivityType } = require('discord.js');

client.on('ready', (c) => {
    
    console.log(`${c.user.tag} is online`); // logging launch
    client.user.setActivity('gooning', { type: ActivityType.Competing });
});

client.on('voiceStateUpdate', (oldState, newState) => {
    const member = newState.member || oldState.member;
    if (!member || member.user.bot) return; // ботов не логируем

    let action = null;

    // Зашёл в войс
    if (!oldState.channelId && newState.channelId) {
        action = 'JOIN';
    }
    // Вышел из войса
    else if (oldState.channelId && !newState.channelId) {
        action = 'LEAVE';
    } else {
        // переключение каналов / муты и т.п. — игнорим
        return;
    }

    // Тег/ник, который будешь использовать в таймлайне
    const username = member.user.username;  // типа "fijiwj", "darklava_" и т.п.

    // Формат времени: YYYY-MM-DD HH:MM:SS
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timestamp =
        `${now.getFullYear()}-` +
        `${pad(now.getMonth() + 1)}-` +
        `${pad(now.getDate())} ` +
        `${pad(now.getHours())}:` +
        `${pad(now.getMinutes())}:` +
        `${pad(now.getSeconds())}`;

    // Строка лога
    const line = `${timestamp} | ${username} | ${action}\n`;

    fs.appendFile(voiceLogPath, line, (err) => {
        if (err) {
            console.error('Ошибка при записи voice-лога:', err);
        } else {
            console.log('voice log:', line.trim());
        }
        });
    });

client.on('messageCreate', async (msg) => { // commands area, not the slash ones

    if (msg.author.bot) { //check if message was sent by bot to avoid repeating to self 
        return;
    }

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
            if ((msg.author.username == '16x9') || (msg.content.length >= 150)) {
                //pass 
            }
        }
    }

    if (msg.content.toLowerCase().includes(" ")) { //чтоб рандомно пиздел
        ranYap(msg, dictionary)
    }

    if ((msg.content != "Processing...") && (msg.author.username != "Leafy"))  { // avoid getting bot's replies in data file required for yapping command
            fs.appendFileSync('src/data.log', msg.content + `\n`);
        }

   // result.value = JSON.stringify(dictionary, undefined, " ")
    fs.writeFileSync('src/data.json', JSON.stringify(dictionary, undefined, " "))

    console.log(`${msg.author.username} - ${msg.content}`) // simple messages log in terminal
    fs.appendFileSync('src/debug.log', (`${msg.author.username} - ${msg.content}`)+`\n`); // logging in file

    if (msg.content.toLowerCase().includes('ватру')) {
        // установка... ээээ... постановка.... ээ.. реакция короче
        try {
            await msg.react('1345303771936456774');
        } catch (error) {
            console.error('Ошибка при добавлении реакции:', error);
        }
    }

    if (msg.content === "") { // can't actually remember what this is, too afraid to delete
        return;
    }

    if (msg.content.toLowerCase().includes("is this true")) { // is this true command
        
    }

    if ((msg.content.toLowerCase().includes("кув")) && (msg.author.username === 'fijiwj')) { // ping with wrong layout
        msg.reply(process.env.RED_PING) 
    }

    if ((msg.content.toLowerCase().includes("@red")) && (msg.author.username === 'fijiwj')) { // ping with wrong layout
        msg.reply(process.env.RED_PING) 
    }
    
    const content = msg.content.toLowerCase()
    if (content.includes('is this true?')) {
        // пикает рандомную из двух пикчу
        const randomImage = images[Math.floor(Math.random() * images.length)];
        // отвечает
        await msg.reply({ files: [randomImage] });
    }

    if (phrases.some(phrase => msg.content.toLowerCase().includes(phrase.toLowerCase())) && msg.author.username === 'lordkekyshka') { // "beggar" reply feature
        msg.reply(process.env.BEGGAR);
    }

    if (authorizedUsers.some(user => msg.author.username.toLowerCase().includes(user.toLowerCase())) && msg.content.toLowerCase().includes("x.com")) { // converting to better x.com links with discord-supported embeds
        return; //!!!!!!!!!!!
        const xstart = (`https://fxtwitter`)
        msg.channel.send(msg.author.username + `: ` + xstart + `` + msg.content.slice(9))
        msg.delete(100)
    };

    if (authorizedUsers.some(user => msg.author.username.toLowerCase().includes(user.toLowerCase())) && msg.content.toLowerCase().includes("vt.tiktok.com")) { // converting to better tiktok links with discord-supported embeds
        return; //!!!!!!!!!!!
        const ttstart = (`https://tfx`)
        msg.channel.send(msg.author.username + `: ` + ttstart + `` + msg.content.slice(13)) // btw this one is for mobile links cuz of vt.
        msg.delete(100)
    };

    if (authorizedUsers.some(user => msg.author.username.toLowerCase().includes(user.toLowerCase())) && msg.content.toLowerCase().includes("tiktok.com")) { // converting to better tiktok links with discord-supported embeds
        return; //!!!!!!!!!!!
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

    if (interaction.commandName === 'voicetimeline') {

    await interaction.reply({ content: 'Voice chat timeline generation in progress...'});

    // путь до проекта с графиками и скриптом скринов
    const pythonCmd = 'python';
    // const pythonProjectDir = 'C:\\Users\\assas\\Desktop\\some_projects\\discord_voice_graphs'; //путь к проекту с графами
    const pythonProjectDir = process.env.PYTHONPROJECTDIR;
    // const pythonScreenshotDir = 'C:\\Users\\assas\\Desktop\\some_projects\\discord_voice_graphs\\screenshots'
    const pythonScreenshotDir = process.env.PYTHONSCREENSHOTDIR
    const scriptPath = 'screenshot.py'; // скрипт ответственный за скриншоты

    // имя файла для скрина
    const filename = `timeline_${Date.now()}.png`;

    // инициализация скрипта
    execFile(
        pythonCmd,
        [scriptPath, filename],
        { cwd: pythonProjectDir },
        async (error, stdout, stderr) => {
            if (error) {
                console.error('Python-script error:', error);
                console.error('stderr:', stderr?.toString());
                return interaction.editReply({
                    content: 'Screenshot generation error'
                });
            }

            // stdout должен содержать путь к файлу (мы делали print(out_path) в make_screenshot.py)
            const outPathFromPython = stdout.toString().trim();
            // Если что-то пошло не так, подстрахуемся своим путём:
            const imgPath = outPathFromPython || require('path').join(pythonProjectDir, filename);

            const attachment = new AttachmentBuilder(imgPath);

            // ждём 8 секунд перед отправкой
            setTimeout(async () => {
                try {
                    await interaction.editReply({
                        content: '24h timeline:',
                        files: [attachment],
                    });
                } catch (sendErr) {
                    console.error('Ошибка при отправке файла в Discord:', sendErr);
                    }
                }, 8000);
            }
        );
    }

    if (interaction.commandName == 'test') { // simple test slash-command, you can use as template
        //regout = reestr[ Math.floor(Math.random() *reestr.length)]
        //interaction.reply(`\`\`\`${regout}\`\`\``)
        interaction.reply(':3')
    }  
    
    if (interaction.commandName == 'x') { // simple test slash-command, you can use as template
        const xstart = (`https://fxtwitter`)
        try {
            const resp = interaction.options.get('x-link')
            if (resp.value?.toLowerCase().includes('x.com')){
                const readlink = (interaction.options.get('x-link'))
                interaction.reply(xstart + readlink.value.slice(9))
            }
            else {
                interaction.reply('link not found')
            }
        } catch (error) {
            interaction.reply('link error')
        }
    }

    if ((interaction.commandName == 'getmsg') && (interaction.user.username === 'fijiwj')) {
        await interaction.reply({ content: 'Processing...', flags: 64 });
        const idsString = interaction.options.get('id').value;
        const ids = idsString.split(',').map(id => id.trim());

        let processed = 0;
        for (const id of ids) {
            try {
                const msg = await interaction.channel.messages.fetch(id);
                console.log(`> ${msg.author.tag} (id:${msg.id}) ${msg.content}`);
                processed++;
            }   catch (err) {
                console.error(`Не удалось получить сообщение ${id}:`, err)
            }
        }

        await interaction.editReply({ content: `Обработано ${processed}/${ids.length} сообщений`, flags: 64 })
    }

    if ((interaction.commandName == 'reactmove') && (interaction.user.username === 'fijiwj')) {
        await interaction.reply({ content: 'Processing...', flags: 64 });

        const payloadStr = interaction.options.get('payload').value;

        let list;
        try {
            list = JSON.parse(payloadStr);
            if (!Array.isArray(list)) throw new Error();
        } catch {
            return interaction.reply({
                content: 'Неверный формат JSON. Ожидается массив объектов { id, grade }.',
                flags: 64
            });
        }

        let success = 0;
        let failed = 0;
        for (const {id, grade} of list) {
            const emoji = gradeEmojis[grade];
            if (!emoji) {
                console.warn(`Unknown grade "${grade}" for message ${id}`);
                failed++;
                continue;
            }
            try {
                const msg = await interaction.channel.messages.fetch(id);
                await msg.react(emoji);
                success++;
            } catch (err) {
                console.error(`Failed to react to ${id}:`, err)
                failed++;
            }
        }

        await interaction.editReply({ content: `Реакций поставлено: ${success}. Ошибок при постановке: ${failed}.`, flags: 64 })

    }

    if (interaction.commandName == 'tt') { // simple test slash-command, you can use as template
        const ttstart = (`https://tfx`)
        await interaction.reply('Processing...');
        try {
            var resp = interaction.options.get('tt-link')
            if (resp.value?.toLowerCase().includes('tiktok.com')){
                var readlink = (interaction.options.get('tt-link'))
                await interaction.editReply(ttstart + readlink.value.slice(14))
            }
            else if (resp.value?.toLowerCase().includes('vt.tiktok.com')){
                var readlink = (interaction.options.get('tt-link'))
                await interaction.editReply(ttstart + readlink.value.slice(13))
            }
            else {
                interaction.editReply('link not found')
                return;
            }
        } catch (error) {
            console.log(error)
            return;
        }
     } 

    if (interaction.commandName == 'yappic') {
        yappic(interaction, dictionary);
        }
    
    if (interaction.commandName == 'yap') {
        handleYap(interaction, dictionary);
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

    if (interaction.commandName === 'banword-add') {

        if (interaction.user.username !== 'fijiwj') {
            return interaction.reply({ content: "Недостаточно прав на выполнение команды.", flags: 64 });
        }

        const filePath = path.join(__dirname, 'bannedWords.json');
        const word = interaction.options.getString('word').trim();

        try {
            const raw = fs.readFileSync(filePath, 'utf8');
            let list = [];

            try {
                list = JSON.parse(raw);
                if (!Array.isArray(list)) list = [];
            } catch (jsonErr) {
                console.error("JSON parse error:", jsonErr);
                list = [];
            }

            if (list.includes(word)) {
                return interaction.reply({
                    content: `Слово **"${word}"** уже есть в списке`,
                    flags: 64
                });
            }

            list.push(word);
            fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf8');

            console.log(`"${word}" успешно добавлено`);
            await interaction.reply({ content: `Добавлено: **"${word}"**`, flags: 64 });

        } catch (err) {
            await interaction.reply({ content: "Произошла ошибка при добавлении слова.", flags: 64 });
        }
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
