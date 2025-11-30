const Canvas = require('@napi-rs/canvas');

const { Client, IntentsBitField, AttachmentBuilder } = require('discord.js'); // discord library

const { GlobalFonts } = require('@napi-rs/canvas');

GlobalFonts.registerFromPath('./src/fonts/segoe-ui-emoji.ttf', 'Segoe');
GlobalFonts.registerFromPath('./src/fonts/NotoColorEmoji.ttf', 'Noto');

async function addTextToImage(text) {
    const canvas = Canvas.createCanvas(800, 600);
    const ctx = canvas.getContext('2d');

    const outputPath = './src/output.png';
    const randompic = Math.floor(Math.random() * 19) + 1; 

    //const randompic = 21; эта для теста 21 пикчи с шаблоном чтоб не рандомило

    const img = await Canvas.loadImage('./src/templates/' + randompic + `.png`); //await canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (randompic == 3) {
        ctx.font = 'bold 40px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'right';

        const bottomOffset = 30;
        const textX = canvas.width / 2;
        const textY = canvas.height - bottomOffset;

        // сначала текст потом обводочку ебашим хоп хоп хлоп 
        ctx.strokeText(text, textX, textY);
        ctx.fillText(text, textX, textY);

        const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' }); //await canvas
        return attachment;
    }

    ctx.font = 'bold 70px Arial';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';        // колiр обводки
    ctx.lineWidth = 8;                // тоощина
    ctx.textAlign = 'center';

    const bottomOffset = 50;
    const textX = canvas.width / 2;
    const textY = canvas.height - bottomOffset;

    //обводка потом текст
    ctx.strokeText(text, textX, textY);
    ctx.fillText(text, textX, textY);

    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' }); //await canvas
    return attachment;
}

module.exports = addTextToImage;