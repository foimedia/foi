const authenticate = require('./authenticate');
const restrictToTelegram = require('./restrictToTelegram');
const restrictToChatAdmin = require('./restrictToChatAdmin');
const restrictToChatMember = require('./restrictToChatMember');
const patchOrCreateMessageUsers = require('./patchOrCreateMessageUsers');
const patchMessageUserChatId = require('./patchMessageUserChatId');
const patchOrCreateMessageChats = require('./patchOrCreateMessageChats');

let hooks = {
  authenticate,
  restrictToTelegram,
  restrictToChatAdmin,
  restrictToChatMember,
  patchOrCreateMessageUsers,
  patchMessageUserChatId,
  patchOrCreateMessageChats
};

module.exports = hooks;
