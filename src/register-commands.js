require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType, applicationDirectory} = require('discord.js');

// node src/register-commands.js IN ROOT FOLDER TO REGISTER SLASH-COMMANDS

const commands = [
    {
        name: 'test',
        description: 'replies with test',
    },
    {
        name: 'voicetimeline',
        description: 'скрин таймлайна со статой',
    },
    {
        name: 'banword-add',
        description: 'adds banned word for yapping (dev only)',
        options: [
            {
                name: 'word',
                description: 'word that will be restricted to use',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
    {
        name: 'x',
        description: 'converts x.com links to better one with discord-supported embed',
        options: [
            {
                name: 'x-link',
                description : 'x.com link',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
    {
        name: 'tt',
        description: 'converts tiktok.com links to better one with discord-supported embed',
        options: [
            {
                name: 'tt-link',
                description : 'tiktok link',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
    {
        name: 'getmsg',
        description: 'get messages by id',
        "integration_types": [0,1],
        "contexts": [0,1,2],
        options: [
            {
                name: 'id',
                description : 'id',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
    {
        name: 'reactmove',
        description: 'react',
        "integration_types": [0,1],
        "contexts": [0,1,2],
        options: [
            {
                name: 'payload',
                description : 'payload',
                type: ApplicationCommandOptionType.String,
                required: true,
            }
        ]
    },
    {
        name: 'yappic',
        description: 'replies with yap picture',
        "integration_types": [0,1],
        "contexts": [0,1,2],
    },
    {
        name: 'yap',
        description: 'yap some shit',
        "integration_types": [0,1],
        "contexts": [0,1,2],
        options: [
            {
                name: 'word-amount',
                description: 'amount of words yapped',
                type: ApplicationCommandOptionType.Number,
                required: false,
            }
        ]
    },
    
    {
        name: 'time',
        description: 'а сколько время у проба?',
    },
    {
        name: 'toggle-screenshot',
        description: 'Переключает доступность команды /screenbread',
    },
    {
        name: 'add',
        description: 'Adds two numbers',
        options: [
            {
                name: 'first-number',
                description: 'The first number',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
            {
                name: 'second-number',
                description: 'The second number',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
        ]
    },
    {
        name: 'screenbread',
        description: 'скриншот рабочего стола проба',
    },

];

const rest = new REST ({ version: '10'}).setToken(process.env.TOKEN);

(async () => {
 try {
    console.log('Registering slash commands...');
    
    // await rest.put(
    //     Routes.applicationGuildCommands(process.env.CLIENT_ID,
    //          process.env.GUILD_ID),
    //     { body: commands}
    // );

    await rest.put(
	Routes.applicationCommands(process.env.CLIENT_ID),
	{ body: commands },
    );
    console.log('Slash commands were registered succesfully!');
 } catch (error) {
    console.log((`There was an error ${error}`));
 }
})();