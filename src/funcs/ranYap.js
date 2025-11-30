const respondChance = require('./chance')
const stats = require('./loadStats')
const saveStats = require('./saveStats');
const path = require('path'); 
const statsFile = path.join(__dirname, '..', 'stats.json');
const ranInt = require('./getRandomInt')
const ranProperty = require('./randomProperty')

function ranYap(msg, dictionary) {
    const ChanceNeeded = 95; //chance to got random respond in %
        const chance = respondChance();
        
        // console.log(`Chance was ${chance}%`) дебаг который пишет вероятность на каждое подходящее сообщение
        if (chance >= ChanceNeeded) {
            stats.yapped = (stats.yapped || 0) + 1;
            saveStats(stats());
            
            try {
                n = ranInt(); 
        
                words = []
                words[0] = ranProperty(dictionary)
                for(i = 0; i < n; i++){
                    // if(words[i].includes("<@")){
                    //     continue
                    // }
                    childWords = dictionary[words[words.length-1]]
                    if(!childWords){
                        console.log(words)
                        break
                    }
                    words.push(childWords[Math.floor(Math.random() * childWords.length)]);
                }
                var output = words.join(" ").slice(0,2000)
                // console.log(`output message: ${output}`)
                msg.reply(output)
                
            } catch (error) {
                console.log(error)
            }
    }
}
module.exports = ranYap;