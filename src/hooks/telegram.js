const _ = require('lodash');

const authenticate = (options = {}) => hook => {
  options = Object.assign({
    telegramIdField: 'telegramId'
  }, hook.app.get('authentication'), options);
  if(hook.type !== 'before') {
    throw new Error(`The 'populateTelegramUser' hook should only be used as a 'before' hook.`);
  }
  if(!options.service) {
    throw new Error(`The 'populateTelegramUser' hook requires an user service.`);
  }
  if(hook.params.telegram) {
    const id = hook.params.message.from.id;
    return hook.app.service(options.service).find({
      query: {
        [options.telegramIdField]: id,
      },
      paginate: false
    }).then(data => {
      hook.params.user = data[0];
      return hook;
    });
  }
  return hook;
}

const patchOrCreateMessageUsers = (options = {}) => hook => {
  options = Object.assign({
    idField: '_id',
    telegramIdField: 'telegramId',
    as: 'telegramData',
    service: 'users',
    all: true
  }, options);
  const service = hook.app.service(options.service);
  const patchOrCreate = user => {
    return service.find({
      query: {
        [options.telegramIdField]: user.id
      },
      paginate: false
    }).then(data => {
      const userData = options.as ? { [options.as]: user } : user;
      if(data.length) {
        return service.patch(data[0][options.idField], userData);
      } else {
        return service.create(userData);
      }
    });
  }
  if(hook.params.telegram) {
    let promises = [];
    const message = hook.params.message;
    if(message.from) {
      promises.push(patchOrCreate(message.from));
    }
    if(options.all && message.forward_from)
      promises.push(patchOrCreate(message.forward_from));
    return Promise.all(promises).then(() => hook);
  }
  return hook;
}

const patchMessageUserChatId = (options = {}) => hook => {
  options = Object.assign({
    idField: '_id',
    telegramIdField: 'telegramId',
    as: 'telegramData.chats',
    service: 'users'
  }, options);
  const service = hook.app.service(options.service);
  if(hook.params.telegram) {
    const id = hook.params.message.from.id;
    const chat = hook.params.message.chat;
    return service.find({
      query: {
        [options.telegramIdField]: id
      },
      paginate: false
    }).then(data => {
      const user = data[0];
      const currentChats = user[options.as] || [];
      return service.patch(user[options.idField], {
        [options.as]: _.union([chat.id], currentChats)
      }).then(() => hook);
    });

  }
  return hook;
}

module.exports = exports = {
  authenticate,
  patchOrCreateMessageUsers,
  patchMessageUserChatId
};
