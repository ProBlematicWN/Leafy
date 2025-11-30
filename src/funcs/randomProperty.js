var randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return keys[Math.round(Math.random() * keys.length - 1)]
};

module.exports = randomProperty;