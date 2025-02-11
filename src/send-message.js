require('dotenv').config();
const { Client, IntentsBitField, ButtonStyle, ButtonBuilder } = require('discord.js');
const getVladivostokTime = require('./vladivostokTime');
const { ActionRowBuilder } = require('discord.js');

// test file to create message with some buttons and logout

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

const roles = [
    {
        id: '1337651734692102196',
        label : 'Red',
    },
    {
        id: '1337651813607931917',
        label : 'Blue',
    },
    {
        id: '1337651842414546944',
        label : 'Green',
    },
];

client.on('ready', async (c) => {
    try {
      const channel = await client.channels.cache.get('834702787131867196');
      if (!channel) return;
  
      const row = new ActionRowBuilder();
  
      roles.forEach((role) => {
        row.components.push(
          new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
        );
      });
  
      await channel.send({
        content: 'Claim or remove a role below.',
        components: [row],
      });
      process.exit();
    } catch (error) {
      console.log(error);
    }
  });

client.login(process.env.TOKEN);