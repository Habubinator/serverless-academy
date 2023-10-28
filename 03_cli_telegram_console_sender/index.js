const TelegramBot = require('node-telegram-bot-api');
const { program } = require('commander');

const {token,chatId} = require('./config/config').getEnv() // A little parsing construction as a solution to not using other external npm packages 

const bot = new TelegramBot(token, {polling: true});

program
  .command("send-message <message>")
  .aliases(["m","message"])
  .description("Send message to TelegramBot")
  .action(async (text) =>{
    await bot.sendMessage(chatId,text)
    process.exit(0)
  })


//https://www.garron.me/en/bits/images/2012/03/10/cat.jpg - tested with this photo of cat
program
  .command("send-photo <path>")
  .aliases(["p","photo"])
  .description("Send photo to TelegramBot. Just drag and drop photo after \"p\" flag")
  .action(async (path) =>{
    await bot.sendPhoto(chatId,path)
    process.exit(0)
  })

program.parse(process.argv)