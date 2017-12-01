'use strict'

// libs
const giphy = require('giphy-api')(process.env.API_KEY)
const TelegramBot = require('telegram-bot-api')
const rand = require('random-seed').create(Date.now())

// constants
const botToken = process.env.BOT_TOKEN
const chatId = process.env.CHAT_ID
const phrases = [
  'contrata os servicos da net virtua ai porra',
  'humano, a sua busca me cansa',
  'guentai mais um poco fdp',
  'sabia que a gestacao dos pandas pode durar de 95 a 160 dias?',
]

// globals
let waitintInput = null

// random messages
const getMessage = () => phrases[rand.intBetween(0, phrases.length - 1)]

// bot
const bot = new TelegramBot({ token: botToken, updates: { enabled: true } })
const botMessage = (text) => bot.sendMessage({ chat_id: chatId, text })
bot.on('update', (update) => {
  if (!update.message || update.message.chat.id != chatId) return
  if (waitintInput == update.message.from.id) {
    waitintInput = null
    getGif(update.message.text)
  } else if (update.message.text == '/healthcheck@qqmerda_bot') {
    botMessage('to vivao')
  } else if (update.message.text == '/giphy@qqmerda_bot') {
    waitintInput = update.message.from.id
    botMessage('q tag arrombado?')
  }
})

// get random gif
const getGif = (tag) => {
  console.log('fetching gif')
  botMessage(getMessage())
  giphy.random(tag)
  .then((res) => {
    console.log('gif fetched')
    sendGif(tag, res.data.image_url, 0)
  })
  .catch((err) => console.error(err))
}

// send gif
const sendGif = (tag, url, count) => {
  if (count == 3) {
    botMessage('sinto muito mas sua pesquisa eh idiota dms')
    console.log('aborting')
    return
  }
  console.log('sending gif')
  botMessage(getMessage())
  bot.sendVideo({
    chat_id: chatId,
    caption: `ta aqui seu ${tag} seu bosta`,
    video: url
  })
  .then((data) => console.log('gif sent'))
  .catch((err) => sendGif(tag, url, count + 1))
}
