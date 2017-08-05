// Application hooks that run for every service
const logger = require('./hooks/logger');
const { when } = require('feathers-hooks-common');
const telegram = require('./telegram').hooks;

module.exports = {
  before: {
    all: [
      when(hook => hook.params.telegram, [
        telegram.patchOrCreateMessageChats({
          idField: 'id',
          telegramIdField: 'id'
        }),
        telegram.patchOrCreateMessageUsers({
          idField: 'id',
          telegramIdField: 'id',
          as: ''
        }),
        telegram.patchMessageUserChatId({
          idField: 'id',
          telegramIdField: 'id',
          as: 'chats'
        }),
        telegram.authenticate({
          telegramIdField: 'id'
        })
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
      when(hook => hook.params.telegram, [
        hook => {
          const chatId = hook.params.message.chat.id;
          hook.app.telegram.sendMessage(chatId, hook.error.message);
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
