const path = require('path'); 
const statsFile = path.join(__dirname, '..', 'stats.json');
var fs = require('fs');

// подгрузка статы
function loadStats() {
  if (!fs.existsSync(statsFile)) {
    fs.writeFileSync(statsFile, JSON.stringify({ yapped: 0 }, null, 2));
  }
  const raw = fs.readFileSync(statsFile);
  return JSON.parse(raw);
}

module.exports = loadStats;