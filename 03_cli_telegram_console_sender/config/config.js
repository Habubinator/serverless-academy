const fs = require('fs');
const path = require('path');
const { parseBuffer } = require('./parser');

const getEnv = () => {
    const envFilePath = path.join(__dirname, '.env');
    const bufferEnv = fs.readFileSync(envFilePath);
    const envObject = parseBuffer(bufferEnv);

    Object.keys((envObject || {})).map(key => {
        if(!process.env[key] && process.env[key] !== envObject[key]){
            process.env[key] = envObject[key];
        }
    });

    const token = process.env.TOKEN;
    const chatId = process.env.CHATID;
    return {
        token,
        chatId
    }
}

module.exports = {
    getEnv
}