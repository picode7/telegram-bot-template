import * as fs from 'fs'
import * as path from 'path'
require('dotenv').config()
import TelegramBot = require('node-telegram-bot-api')
import { log } from './log'

const token = process.env.TELEGRAM_TOKEN
if (!token) throw 'TELEGRAM_TOKEN is undefined'

const greeting = (msg: TelegramBot.Message) => {
  bot.sendMessage(msg.chat.id, 'Hello!')
}

const echo = (msg: TelegramBot.Message, match: RegExpExecArray | null) => {
  if (match == null || typeof match[1] === 'undefined') bot.sendMessage(msg.chat.id, 'echo')
  else bot.sendMessage(msg.chat.id, match[1].trim())
}

const keyboard = (msg: TelegramBot.Message) => {
  bot.sendMessage(msg.chat.id, 'Hi', {
    reply_markup: {
      keyboard: [[{ text: 'Sample text' }, { text: 'Sample 1' }], [{ text: 'Sample asd' }], [{ text: 'Sample aaaa' }]],
    },
  })
}

const inlineKeyboard = (msg: TelegramBot.Message) => {
  // When a button is clicked, it will trigger the callback_query event
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

// https://core.telegram.org/bots/api#callbackquery
// https://core.telegram.org/bots/api#answercallbackquery
const callbackQuery = (query: TelegramBot.CallbackQuery) => {
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
}

// Load Saved Data
const dataFile = 'data/data.json'
let data: any = null
try {
  data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
} catch (e) {}
function saveData() {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true })
  fs.writeFileSync(dataFile, JSON.stringify({ activeGroups }))
}

// We have to keep track where we are invited our selfs ...
let activeGroups: TelegramBot.Chat[] = data?.activeGroups ?? []
saveData()

function broadcastToGroups(text: string, options?: TelegramBot.SendMessageOptions) {
  for (const group of activeGroups) {
    bot.sendMessage(group.id, text, options)
  }
}

// Bot Setup
const bot = new TelegramBot(token, { polling: true })
let botUser: TelegramBot.User | undefined
bot.getMe().then((v) => {
  botUser = v
})
bot.onText(/\/start/, greeting) // triggered joining a private chat (not group)
bot.on('new_chat_members', (msg) => {
  if (msg.new_chat_members?.find((v) => v.id == botUser?.id)) {
    greeting(msg)
    activeGroups.push(msg.chat)
    saveData()
  }
}) // triggered when joining a group
bot.on('left_chat_member', (msg) => {
  // When bot leaves group
  if (msg.new_chat_members?.find((v) => v.id == botUser?.id)) {
    const index = activeGroups.findIndex((v) => {
      v.id === msg.chat.id
    })
    activeGroups.splice(index, 1)
    saveData()
  }
})

bot.setMyCommands([
  // Shows autocomplete list of commands to the user
  // https://core.telegram.org/bots/api#botcommand
  { command: 'echo', description: 'Echo Text Sample' },
  { command: 'keyboard', description: 'Keyboard Sample' },
  { command: 'inline_keyboard', description: 'Inline Keyboard Sample' },
])
bot.onText(/\/echo/, echo)
bot.onText(/\/echo (.+)/, echo)
bot.onText(/\/keyboard/, keyboard)
bot.onText(/\/inline_keyboard/, inlineKeyboard)
bot.on('callback_query', callbackQuery)
broadcastToGroups('back online!')

// All events ...
bot.on('animation', (msg) => {
  log('event', 'animation', msg)
})
bot.on('audio', (msg) => {
  log('event', 'audio', msg)
})
bot.on('callback_query', (msg) => {
  log('event', 'callback_query', msg)
})
bot.on('channel_chat_created', (msg) => {
  log('event', 'channel_chat_created', msg)
})
bot.on('channel_post', (msg) => {
  log('event', 'channel_post', msg)
})
bot.on('chosen_inline_result', (msg) => {
  log('event', 'chosen_inline_result', msg)
})
bot.on('contact', (msg) => {
  log('event', 'contact', msg)
})
bot.on('delete_chat_photo', (msg) => {
  log('event', 'delete_chat_photo', msg)
})
bot.on('document', (msg) => {
  log('event', 'document', msg)
})
bot.on('edited_channel_post', (msg) => {
  log('event', 'edited_channel_post', msg)
})
bot.on('edited_channel_post_caption', (msg) => {
  log('event', 'edited_channel_post_caption', msg)
})
bot.on('edited_channel_post_text', (msg) => {
  log('event', 'edited_channel_post_text', msg)
})
bot.on('edited_message', (msg) => {
  log('event', 'edited_message', msg)
})
bot.on('edited_message_caption', (msg) => {
  log('event', 'edited_message_caption', msg)
})
bot.on('edited_message_text', (msg) => {
  log('event', 'edited_message_text', msg)
})
bot.on('error', (msg) => {
  log('event', 'error', msg)
})
bot.on('game', (msg) => {
  log('event', 'game', msg)
})
bot.on('group_chat_created', (msg) => {
  log('event', 'group_chat_created', msg)
})
bot.on('inline_query', (msg) => {
  log('event', 'inline_query', msg)
})
bot.on('invoice', (msg) => {
  log('event', 'invoice', msg)
})
bot.on('left_chat_member', (msg) => {
  // Also triggers when bot is removed from the group
  // msg.left_chat_member
  log('event', 'left_chat_member', msg)
})
bot.on('location', (msg) => {
  log('event', 'location', msg)
})
bot.on('message', (msg) => {
  // Triggers for most other events as well
  log('event', 'message', msg)
})
bot.on('migrate_from_chat_id', (msg) => {
  log('event', 'migrate_from_chat_id', msg)
})
bot.on('migrate_to_chat_id', (msg) => {
  log('event', 'migrate_to_chat_id', msg)
})
bot.on('new_chat_members', (msg) => {
  // Also triggers when bot is added to the group
  // msg.new_chat_member, msg.new_chat_members
  log('event', 'new_chat_members', msg)
})
bot.on('new_chat_photo', (msg) => {
  log('event', 'new_chat_photo', msg)
})
bot.on('new_chat_title', (msg) => {
  log('event', 'new_chat_title', msg)
})
bot.on('passport_data', (msg) => {
  log('event', 'passport_data', msg)
})
bot.on('photo', (msg) => {
  log('event', 'photo', msg)
})
bot.on('pinned_message', (msg) => {
  log('event', 'pinned_message', msg)
})
bot.on('poll_answer', (msg) => {
  log('event', 'poll_answer', msg)
})
bot.on('polling_error', (msg) => {
  log('event', 'polling_error', msg)
})
bot.on('pre_checkout_query', (msg) => {
  log('event', 'pre_checkout_query', msg)
})
bot.on('shipping_query', (msg) => {
  log('event', 'shipping_query', msg)
})
bot.on('sticker', (msg) => {
  log('event', 'sticker', msg)
})
bot.on('successful_payment', (msg) => {
  log('event', 'successful_payment', msg)
})
bot.on('supergroup_chat_created', (msg) => {
  log('event', 'supergroup_chat_created', msg)
})
bot.on('text', (msg) => {
  // Triggers like onText
  log('event', 'text', msg)
})
bot.on('video', (msg) => {
  log('event', 'video', msg)
})
bot.on('video_note', (msg) => {
  log('event', 'video_note', msg)
})
bot.on('voice', (msg) => {
  log('event', 'voice', msg)
})
bot.on('webhook_error', (msg) => {
  log('event', 'webhook_error', msg)
})
