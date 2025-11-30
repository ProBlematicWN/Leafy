const path = require('path'); 
const statsFile = path.join(__dirname, '..', 'stats.json');
var fs = require('fs');

// сохранение статы
function saveStats(stats) {
  // console.log("statsFile =", statsFile);
  // console.log("stats =", stats); //дебаг на случай если возникают проблемы с записью статистики
  fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
}

module.exports = saveStats;