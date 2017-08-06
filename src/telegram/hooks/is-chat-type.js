const errors = require('feathers-errors');

module.exports = (options = {}) => hook => {
  options = Object.assign({
    type: '',
    service: 'chats'
  }, options);
  if(hook.params.telegram && hook.params.message) {
    const message = hook.params.message;
    return message.chat.type == options.type;
  } else if (options.service) {
    const service = hook.app.service(options.service);
    return service.get(hook.id).then(chat => chat.type == options.type);
  }
  return hook;
}
