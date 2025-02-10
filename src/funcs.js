function getVladivostokTime() {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const vladivostokOffset = 10 * 60 * 60000; 
    const vladivostokTime = new Date(utcTime + vladivostokOffset);
    return vladivostokTime.toLocaleString('ru-RU', { timeZone: 'Asia/Vladivostok' });
}

module.exports = getVladivostokTime;
