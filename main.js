'use strict'

// libs
const giphy = require('giphy-api')(process.env.API_KEY)
const TelegramBot = require('telegram-bot-api')
const request = require('request-promise-native')
const rand = require('random-seed').create(Date.now())

// constants
const botToken = process.env.BOT_TOKEN
const chatIds = process.env.CHAT_IDS.split(' ').map(id => Number(id))
const quoteUrl = 'http://inspirobot.me'
const requestAttempts = 3
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
    getGif(chat, text, 0)
  } else if (text == '/healthcheck@qqmerda_bot') {
    botMessage(chat, 'to vivao nenem')
  } else if (text == '/giphy@qqmerda_bot') {
    s.add(user)
    botMessage(chat, 'q tag arrombado?')
  } else if (text == '/quote@qqmerda_bot') {
    getQuote(chat, 0)
  }
})

// get random gif
const getGif = (chat, tag, count) => {
  if (count == requestAttempts) {
    botMessage(chat, 'nao foi dessa vez amigo')
    return
  }
  botMessage(chat, getMessage())
  giphy.random(tag)
  .then((res) => sendGif(chat, tag, res.data.image_url, 0))
  .catch(err => getGif(chat, tag, count + 1))
}

// send gif
const sendGif = (chat_id, tag, url, count) => {
  if (count == requestAttempts) {
    botMessage(chat_id, 'sinto muito mas sua pesquisa eh idiota d+')
    return
  }
  botMessage(chat_id, getMessage())
  bot.sendVideo({
    chat_id,
    caption: `ta aqui seu ${tag} seu bosta`,
    video: url
  })
  .catch(err => sendGif(chat_id, tag, url, count + 1))
}

// get random quote
const getQuote = (chat, count) => {
  if (count == requestAttempts) {
    botMessage(chat, 'sinto muito mas va toma no cu')
    return
  }
  botMessage(chat, getMessage())
  request({
    baseUrl: quoteUrl,
    uri: '/api',
    qs: { generate: true }
  })
  .then(url => sendQuote(chat, url, 0))
  .catch(err => getQuote(chat, count + 1))
}

// send quote
const sendQuote = (chat_id, url, count) => {
  if (count == requestAttempts) {
    botMessage(chat_id, 'e aquele plano da net virtua?')
    return
  }
  botMessage(chat_id, getMessage())
  bot.sendPhoto({
    chat_id,
    caption: 'agora vc pode voltar pro gdb',
    photo: url
  })
  .catch(err => sendQuote(chat_id, url, count + 1))
}
