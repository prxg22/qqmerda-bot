'use strict'

// libs
const giphy = require('giphy-api')(process.env.API_KEY)
const TelegramBot = require('telegram-bot-api')
const rand = require('random-seed').create(Date.now())

// constants
const botToken = process.env.BOT_TOKEN
const chatIds = process.env.CHAT_IDS.split(' ').map(id => Number(id))
const phrases = [
  'contrata os servicos da net virtua ai porra',
  'humano, a sua busca me cansa',
  'guentai mais um poco fdp',
  'sabia que a gestacao dos pandas pode durar de 95 a 160 dias?',
]

// globals
const waitintInput = new Map()
chatIds.forEach(id => waitintInput.set(id, new Set()))

// random messages
const getMessage = () => phrases[rand.intBetween(0, phrases.length - 1)]

// bot
const bot = new TelegramBot({ token: botToken, updates: { enabled: true } })
const botMessage = (chat_id, text) => bot.sendMessage({ chat_id, text })
bot.on('update', (update) => {
  if (!update.message || chatIds.indexOf(update.message.chat.id) < 0) return
  const chat = update.message.chat.id
  const user = update.message.from.id
  const text = update.message.text
  const s = waitintInput.get(chat)
  if (s.has(user)) {
    s.delete(user)
    getGif(chat, text)
  } else if (text == '/healthcheck@qqmerda_bot') {
    botMessage(chat, 'to vivao nenem')
  } else if (text == '/giphy@qqmerda_bot') {
    waitintInput = update.message.from.id
    s.add(user)
    botMessage(chat, 'q tag arrombado?')
  }
})

// get random gif
const getGif = (chat, tag) => {
  console.log('fetching gif')
  botMessage(chat, getMessage())
  giphy.random(tag)
  .then((res) => {
    console.log('gif fetched')
    sendGif(chat, tag, res.data.image_url, 0)
  })
  .catch((err) => console.error(err))
}

// send gif
const sendGif = (chat_id, tag, url, count) => {
  if (count == 3) {
    botMessage(chat_id, 'sinto muito mas sua pesquisa eh idiota d+')
    console.log('aborting')
    return
  }
  console.log('sending gif')
  botMessage(chat_id, getMessage())
  bot.sendVideo({
    chat_id,
    caption: `ta aqui seu ${tag} seu bosta`,
    video: url
  })
  .then((data) => console.log('gif sent'))
  .catch((err) => sendGif(chat_id, tag, url, count + 1))
}
