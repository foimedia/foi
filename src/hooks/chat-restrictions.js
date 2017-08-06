const errors = require('feathers-errors');

const restrictMuted = () => hook => {
  const chatId = hook.data.chatId;
  if(hook.params.user && chatId !== undefined && hook.params.user.chats[chatId].muted) {
    throw new errors.Forbidden('You are muted');
  }
  return hook;
};

const restrictArchived = () => hook => {
  const chatId = hook.data.chatId;
  if(chatId !== undefined) {
    const chatService = hook.app.service('chats');
    return chatService.get(chatId).then(chat => {
      if(chat.archived) {
        throw new errors.Forbidden('This chat is archived');
      }
      return hook;
    })
  } else {
    return hook;
  }
};

module.exports = {
  restrictMuted,
  restrictArchived
}
