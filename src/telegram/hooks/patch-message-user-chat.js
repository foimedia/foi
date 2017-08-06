const _ = require('lodash');

module.exports = (options = {}) => hook => {
  options = Object.assign({
    telegramIdField: 'telegramId',
    service: 'users',
    as: 'telegram.chats'
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
      const currentChats = user[options.as] || {};
      return service.patch(user[service.id], {
        [`${options.as}.${chat.id}`]: Object.assign(currentChats[chat.id] || {}, {})
      }).then(() => hook);
    });

  }
  return hook;
};
