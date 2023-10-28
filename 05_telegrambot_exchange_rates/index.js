const TelegramBot = require('node-telegram-bot-api');
const axios = require("axios")
const NodeCache = require( "node-cache" );

const {botToken, weatherApiToken} = require("./config/config").getEnv()

const bot = new TelegramBot(botToken, {polling: true});
bot.setMyCommands([{ command: '/start', description: 'Start the bot' }])

const myCache = new NodeCache({useClones: false});

let defaultOptions = {
    reply_markup: {
        keyboard: [
            ['Forecast in Odesa'],
            ['Excange rates']
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
                return bot.sendMessage(chatId, 'I am a bot that sending forecast and exchange rates!',options);
    
            // 04 Task
    
            case 'Forecast in Odesa':
                options = {
                    reply_markup: {
                        keyboard: [
                            ['At intervals of 3 hours','At intervals of 6 hours'],
                            ["Back to menu"]
                        ],
                        resize_keyboard: true 
                    }
                }
                return bot.sendMessage(chatId, 'Pick menu option to know Odesa forecast!',options);
            case "At intervals of 3 hours":
                return bot.sendMessage(chatId, 'Weather forecast:\n'+await findForecast(3),defaultOptions);
            case "At intervals of 6 hours":
                return bot.sendMessage(chatId, 'Weather forecast:\n'+await findForecast(6),defaultOptions);
            
            // 05 Task

            case 'Excange rates':
                options = {
                    reply_markup: {
                        keyboard: [
                            ['USD','EUR'],
                            ["Back to menu"]
                        ],
                        resize_keyboard: true 
                    }
                }
                return bot.sendMessage(chatId, 'Pick menu option to know UAH excange rates!',options);
            case "USD":
            case "EUR":
                monoExchange = await findExchange("Mono", msg.text);
                privatExchange = await findExchange("Privat", msg.text)
                return bot.sendMessage(chatId, `Monobank exchange rates: \n${monoExchange}Privat24 exchange rates: \n${privatExchange}` ,defaultOptions);
                
            case "Back to menu":
                return bot.sendMessage(chatId, 'Back to menu',defaultOptions);

            default:
                return bot.sendMessage(chatId, 'Use /start or buttons to communicate with bot', defaultOptions);
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

async function findExchange(bankName, currencyCode){

    switch(bankName){

        case "Privat":

            response = myCache.get("PrivatResponce");
            if (!response){
                response = await axios.get('https://api.privatbank.ua/p24api/pubinfo?exchange&coursid=11');
                myCache.set("PrivatResponce", response, 300);
            }

            pos = ['EUR', 'USD'].indexOf(currencyCode)
            if(pos == -1)   throw new Error("Not supported currencyCode. Try 'USD' or 'EUR'");
            
            emoji = currencyCode == "USD"? "🇺🇸" : "🇪🇺"; 

            return `${emoji} Buy: ${(+response.data[pos].buy).toFixed(2)} Sell: ${(+response.data[pos].sale).toFixed(2)} \n`;

        case "Mono":
            
            response = myCache.get("MonoResponce");
            if (!response){
                response = await axios.get('https://api.monobank.ua/bank/currency');
                myCache.set("MonoResponce", response, 300);
            }

            let excangeData;

            switch(currencyCode){

                case "USD":
                    excangeData = response.data.filter((value)=>{
                        return value.currencyCodeB == 980 && value.currencyCodeA == 840
                    })
                    break;

                case "EUR":
                    excangeData = response.data.filter((value)=>{
                        return value.currencyCodeB == 980 && value.currencyCodeA == 978
                    })
                    break;

                default:
                    throw new Error("Not supported currencyCode. Try 'USD' or 'EUR'")
            }

            emoji = currencyCode == "USD"? "🇺🇸" : "🇪🇺"; 

            return `${emoji} Buy: ${excangeData[0].rateBuy.toFixed(2)} Sell: ${excangeData[0].rateSell.toFixed(2)} \n`;

        default :
            throw new Error("Not supported bank name. Try 'Privat' or 'Mono'.")
    }
}