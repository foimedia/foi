// Application hooks that run for every service
const logger = require("./hooks/logger");
const { when } = require("feathers-hooks-common");
const telegram = require("feathers-telegram-bot").hooks;

module.exports = {
  before: {
    all: [
      when(telegram.isTelegram(), [
        telegram.patchOrCreateMessageChats(),
        telegram.patchOrCreateMessageUsers({
          telegramIdField: "id",
          as: ""
        }),
        telegram.patchMessageUserChat({
          telegramIdField: "id",
          as: "chats"
        }),
        telegram.authenticate({
          telegramIdField: "id"
        }),
        hook => {
          hook.params.provider = "telegram";
        }
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
    all: [logger()],
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
          const telegram = hook.app.telegram;
          const chatId = hook.params.message.chat.id;
          if (!hook.error.silent)
            telegram.sendMessage(chatId, hook.error.message);
          if (hook.error.leaveChat) {
            telegram.leaveChat(chatId);
          }
          return hook;
        },
        // Always send error message for bot commands
        when(telegram.isBotCommand(), [
          hook => {
            const telegram = hook.app.telegram;
            const chatId = hook.params.message.chat.id;
            if (hook.error.silent) {
              telegram.sendMessage(chatId, hook.error.message);
            }
            return hook;
          }
        ])
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
