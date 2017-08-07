const errors = require('feathers-errors');
const { when, iffElse } = require('feathers-hooks-common');
const { restrictToRoles } = require('feathers-authentication-hooks');
const { isTelegram, isChatType } = require('../telegram').hooks;

const restrictToActive = () => hook => {
  const chatId = hook.data.chatId;
  if(chatId !== undefined) {
    const chatService = hook.app.service('chats');
    return chatService.get(chatId).then(chat => {
      if(!chat.active) {
        throw new errors.Forbidden('This is not an active chat');
      }
      return hook;
    });
  } else {
    return hook;
  }
};

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

const restrictChatContent = [
  restrictArchived(),
  restrictMuted(),
  when(
    isTelegram(),
    iffElse(
      isChatType({ type: 'private' }),
      [
        restrictToRoles({ roles: 'publisher', idField: 'id' })
      ],
      [
        restrictToActive()
      ]
    )
  )
];

const mutedError = () => hook => {
  if(hook.error.message == 'You are muted') {
    hook.error.silent = true;
  };
  return hook;
};

const archivedError = () => hook => {
  if(hook.error.message == 'This chat is archived') {
    hook.error.silent = true;
  };
  return hook;
}

const restrictChatContentErrors = [
  mutedError(),
  archivedError()
];

module.exports = {
  restrictToActive,
  restrictMuted,
  restrictArchived,
  restrictChatContent,
  mutedError,
  archivedError,
  restrictChatContentErrors
};
