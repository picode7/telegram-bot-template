require('dotenv').config()
import TelegramBot = require('node-telegram-bot-api')

const token = process.env.TELEGRAM_TOKEN
if (!token) throw 'TELEGRAM_TOKEN is undefined'

const echo = (msg: TelegramBot.Message, match: RegExpExecArray | null) => {
  if (msg.text) bot.sendMessage(msg.chat.id, msg.text.trim())
}

const keyboard = (msg: TelegramBot.Message) => {
  bot.sendMessage(msg.chat.id, 'Hi', {
    reply_markup: {
      keyboard: [[{ text: 'Sample text' }, { text: 'Sample 1' }], [{ text: 'Sample asd' }], [{ text: 'Sample aaaa' }]],
    },
  })
}

const inlineKeyboard = (msg: TelegramBot.Message) => {
  bot.sendMessage(msg.chat.id, 'Please select an action:', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Simple query', callback_data: 'simple-query' },
          { text: 'Alert query', callback_data: 'alert-query' },
        ],
        [{ text: 'Answer and Hide', callback_data: 'answer-and-hide' }],
      ],
    },
  })
}

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true })

// https://core.telegram.org/bots/api#botcommand
bot.setMyCommands([
  { command: 'echo', description: 'Echo Text Sample' },
  { command: 'keyboard', description: 'Keyboard Sample' },
  { command: 'inline_keyboard', description: 'Inline Keyboard Sample' },
])
bot.onText(/\/echo (.+)/, echo)
bot.onText(/\/keyboard/, keyboard)
bot.onText(/\/inline_keyboard/, inlineKeyboard)

// https://core.telegram.org/bots/api#callbackquery
// https://core.telegram.org/bots/api#answercallbackquery
bot.on('callback_query', (query) => {
  // check query.inline_message_id if you want make sure it come from a specific message
  if (query.data == 'simple-query') {
    bot.answerCallbackQuery(query.id, { text: 'ok ...' })
  } else if (query.data == 'alert-query') {
    bot.answerCallbackQuery(query.id, { show_alert: true, text: 'Ok!' })
  } else if (query.data == 'answer-and-hide') {
    bot.answerCallbackQuery(query.id, { text: 'done ...' })
    bot.editMessageReplyMarkup(
      { inline_keyboard: [] },
      { message_id: query.message?.message_id, chat_id: query.message?.chat.id }
    )
  } else {
    bot.answerCallbackQuery(query.id)
  }
})
