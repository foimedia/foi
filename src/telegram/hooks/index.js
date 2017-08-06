const authenticate = require('./authenticate');
const restrictToTelegram = require('./restrict-to-telegram');
const restrictToChatAdmin = require('./restrict-to-chat-admin');
const restrictToChatMember = require('./restrict-to-chat-member');
const patchOrCreateMessageUsers = require('./patch-or-create-message-users');
const patchMessageUserChat = require('./patch-message-user-chat');
const patchOrCreateMessageChats = require('./patch-or-create-message-chats');
const isTelegram = require('./is-telegram');
const isBotCommand = require('./is-bot-command');
const isChatType = require('./is-chat-type');

let hooks = {
  authenticate,
  restrictToTelegram,
  restrictToChatAdmin,
  restrictToChatMember,
  patchOrCreateMessageUsers,
  patchMessageUserChat,
  patchOrCreateMessageChats,
  isTelegram,
  isBotCommand,
  isChatType
};

module.exports = hooks;
