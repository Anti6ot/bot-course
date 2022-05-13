const TelegramApi = require('node-telegram-bot-api')
const command = require('nodemon/lib/config/command')

const token = '5160362186:AAHCONXXSyZ__p3EYW3ptJQruwzZ-DSg41g'
const {gameOptions, againOptions} = require('./optons')
const bot = new TelegramApi(token, { polling: true })

const chats = {}



const starGame = async (chatId) => {
    await bot.sendMessage(chatId, `Я загадаю цифру от 0 до 9, а ты должна угадать`);
    const randomNumber = Math.floor(Math.random() * 2);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Отгадывай`, gameOptions);
    // console.log(randomNumber);
}
// after click but start
const start = () => {

    bot.setMyCommands([  /* спомощью комманд API добавили две кнопки в тг */
        { command: '/start', description: 'Начальное приветствие' },
        { command: '/game', description: 'Угадай цифру' }
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        // console.log(msg);
        if (text === '/start') {
            await bot.sendSticker(chatId, `https://tlgrm.ru/_/stickers/5cc/7a5/5cc7a5e5-1c4d-4eb5-8ea2-94a23e4142a9/7.webp`)
            return bot.sendMessage(chatId, `Добро Пожаловать Крошка`)
        }
        if (text === '/game') {
            return starGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, напиши Николаю или попробуй еще раз!')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again'){
           return starGame(chatId)
        }
        if (+data === chats[chatId]) {
            return  bot.sendMessage(chatId, `поздравляю ты отгадала ${chats[chatId]}`, againOptions)
        } else {
            return  bot.sendMessage(chatId, `К сожалению ты не угадала, я загадал ${chats[chatId]}`, againOptions)
        }
    })
}
start()
