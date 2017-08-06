const errors = require('feathers-errors');

module.exports = (options = {}) => hook => {
  options = Object.assign({
    userIdField: 'telegramId',
    chatIdField: 'telegramId',
    service: 'chats',
    fromMessage: true
  }, options)
  if(hook.type !== 'before') {
    throw new Error(`The 'restrictToChatAdmin' hook should only be used as a 'before' hook.`);
  }
  const userId = hook.params.user[options.userIdField];
  let chatId;
  if(hook.params.telegram && options.fromMessage) {
    chatId = hook.params.message.chat.id;
  } else {
    chatId = hook.id || hook.query[chatIdField];
  }
  const service = hook.app.service(options.service);
  return service.find({
    query: {
      [options.chatIdField]: chatId
    },
    paginate: false
  }).then(data => {
    const chat = data[0];
    if(chat.type == 'private' || chat.all_members_are_administrators) {
      return hook;
    } else {
      return hook.app.telegram.getChatAdministrators(chatId).then(admins => {
        if(!admins.some(admin => admin.user.id == userId))
          throw new errors.Forbidden('You must be a chat admin to perform this action');
        return hook;
      })
    }
  })
};
