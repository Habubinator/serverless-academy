const TelegramBot = require('node-telegram-bot-api');
const axios = require("axios")

const {botToken, weatherApiToken} = require("./config/config").getEnv()

const bot = new TelegramBot(botToken, {polling: true});
bot.setMyCommands([{ command: '/start', description: 'Start the bot' }])

let defaultOptions = {
    reply_markup: {
        keyboard: [
            ['Forecast in Odesa']
        ],
        resize_keyboard: true 
    }
}

bot.on("text", async (msg) => {
    const chatId = msg.chat.id;
    const msgText = msg.text;
    let options;
    try {
        switch (msgText){
            case "/start":
                options = defaultOptions
                return bot.sendMessage(chatId, 'I am a bot that sending forecast!',options);
    
            // 04 Task
    
            case 'Forecast in Odesa':
                options = {
                    reply_markup: {
                        keyboard: [
                            ['At intervals of 3 hours'],
                            ['At intervals of 6 hours']
                        ],
                        resize_keyboard: true 
                    }
                }
                return bot.sendMessage(chatId, 'I am a bot that sending forecast!',options);
            case "At intervals of 3 hours":
                return bot.sendMessage(chatId, 'Weather forecast:\n'+await findForecast(3),defaultOptions);
            case "At intervals of 6 hours":
                return bot.sendMessage(chatId, 'Weather forecast:\n'+await findForecast(6),defaultOptions);
            
        }
    } catch (error) {
        console.log("Error" + error)
        return bot.sendMessage(chatId, "Error has occured. \nMaybe API services is temporaly down",defaultOptions);
    }
});

async function findForecast(interval){

    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
            params: {
                "lat": 46.482952,
                "lon": 30.712481,
                "appid": weatherApiToken
            }
    });

    const weatherDataArr = response.data.list;

    const step = interval / 3 === 1 ? 1 : 2;
    let result = "";

    for (let i = 0; i < weatherDataArr.length; i += step) {

        let date = convertTimestamptoTime(weatherDataArr[i].dt)
        let degrees = (weatherDataArr[i].main.temp - 273.15).toFixed(2)
        let wind = weatherDataArr[i].wind.speed.toFixed(2)
        let weatherEmoji = findWeatherEmoji(weatherDataArr[i].weather[0].main)

        result += `${date} - 🌡️ ${degrees} °C 💨 ${wind} Km/h ${weatherEmoji}\n`;
    }

    return result;
}

function convertTimestamptoTime(unixTimestamp) {

    let dateObj = new Date(unixTimestamp * 1000);
    let utcString = dateObj.toUTCString();
    let time = utcString.slice(5, 12) + utcString.slice(-12, -7);

    return time;

}

function findWeatherEmoji(condition) {
    const emojis = {
        "Thunderstorm": "⛈",
        "Drizzle": "🌦",
        "Rain": "🌧",
        "Snow": "❄️",
        "Clear": "☀️",
        "Clouds": "⛅️",
    };
    return emojis[condition] || "🌫";
}