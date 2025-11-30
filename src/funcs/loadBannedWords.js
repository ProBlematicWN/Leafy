const path = require('path'); 
var fs = require('fs');

function loadBannedWords() {
    const data = fs.readFileSync('./src/bannedWords.json', 'utf8');
    return JSON.parse(data);
}

module.exports = loadBannedWords;