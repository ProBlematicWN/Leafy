require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType} = require('discord.js');

// node src/register-commands.js IN ROOT FOLDER TO REGISTER SLASH-COMMANDS

const commands = [
    {
        name: 'test',
        description: 'replies with test',
    },
    {
        name: 'yap',
        description: 'yap some shit',
        options: [
            {
                name: 'amount',
                description: 'amount of words',
                type: ApplicationCommandOptionType.Number,
                required: true,
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
    
    await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID,
             process.env.GUILD_ID),
        { body: commands}
    );
    console.log('Slash commands were registered succesfully!');
 } catch (error) {
    console.log((`There was an error ${error}`));
 }
})();