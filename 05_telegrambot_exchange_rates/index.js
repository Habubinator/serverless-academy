const TelegramBot = require('node-telegram-bot-api');

const {botToken} = require("./config/config").getEnv()

const bot = new TelegramBot(botToken, {polling: true});
bot.setMyCommands([{ command: '/start', description: 'Start the bot' }])

const findForecast = require("./forecast.js")
const findExchange = require("./exchange.js")

let defaultOptions = {
    reply_markup: {
        keyboard: [
            ['Forecast in Odesa'],
            ['Exchange rates']
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

            case 'Exchange rates':
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