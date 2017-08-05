const _ = require('lodash');

module.exports = (options = {}) => hook => {
  options = Object.assign({
    idField: '_id',
    telegramIdField: 'telegramId',
    as: 'telegram.chats',
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
};
