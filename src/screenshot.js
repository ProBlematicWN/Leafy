const screenshot = require('screenshot-desktop');
const fs = require('fs');
const path = require('path');

const saveFolder = path.join(__dirname, 'screenshot-project');

async function takeScreenshot() {
    try {
        const img = await screenshot();
        const filePath = path.join(saveFolder, `screenshot-${timestamp}.png`);

        fs.writeFileSync(filePath, img);
        console.log(`Скриншот сохранен: ${filePath}`);
    } catch (error) {
        console.error('Ошибка при создании скриншота:', error);
    }
}

takeScreenshot();