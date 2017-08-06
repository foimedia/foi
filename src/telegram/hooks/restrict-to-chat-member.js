const errors = require('feathers-errors');

module.exports = (options = {}) => hook => {
  options = Object.assign({
    userIdField: 'telegramId',
    chatIdField: 'telegramId',
    fromMessage: true
  }, options)
  if(hook.type !== 'before') {
    throw new Error(`The 'restrictToChatMember' hook should only be used as a 'before' hook.`);
  }
  const userId = hook.params.user[options.userIdField];
  let chatId;
  if(hook.params.telegram && options.fromMessage) {
    chatId = hook.params.message.chat.id;
  } else {
    chatId = hook.id || hook.query[chatIdField];
  }
  return hook.app.telegram.getChatMember(chatId, userId)
    .then(() => hook)
    .catch(() => {
      throw new errors.Forbidden('You are not part of this chat');
      return hook;
    });
};
