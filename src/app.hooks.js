// Application hooks that run for every service
const logger = require('./hooks/logger');
const { when } = require('feathers-hooks-common');
const telegram = require('./telegram').hooks;

module.exports = {
  before: {
    all: [
      when(telegram.isTelegram(), [
        telegram.patchOrCreateMessageChats(),
        telegram.patchOrCreateMessageUsers({
          telegramIdField: 'id',
          as: ''
        }),
        telegram.patchMessageUserChat({
          telegramIdField: 'id',
          as: 'chats'
        }),
        telegram.authenticate({
          telegramIdField: 'id'
        }),
        hook => { hook.params.provider = 'telegram' }
      ])
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [
      logger(),
      when(telegram.isTelegram(), [
        hook => {
          const chatId = hook.params.message.chat.id;
          hook.app.telegram.sendMessage(chatId, hook.error.message);
          return hook;
        }
      ])
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
