const _ = require('lodash');

module.exports = (options = {}) => hook => {
  options = Object.assign({
    service: 'chats',
    userAs: 'users',
    all: true
  }, options);
  const service = hook.app.service(options.service);
  const patchOrCreate = chat => {
    return service.find({
      query: {
        [service.id]: chat.id
      },
      paginate: false
    }).then(data => {
      if(data.length) {
        if(chat[options.userAs]) {
          chat[options.userAs] = _.union(data[0][options.userAs] || [], chat[options.userAs]);
        }
        const props = Object.keys(chat);
        const changed = props.some(prop => (
          JSON.stringify(data[0][prop]) != JSON.stringify(chat[prop])
        ));
        if(changed) {
          return service.patch(data[0][service.id], _.omit(chat, ['id']));
        } else {
          return Promise.resolve(data[0]);
        }
      } else {
        return service.create(Object.assign({
          [service.id]: chat.id
        }, _.omit(chat, ['id'])));
      }
    })
  }
  if(hook.params.telegram) {
    let promises = [];
    const message = hook.params.message;
    if(message.chat) {
      let chat = Object.assign({}, message.chat);
      if(options.userAs) {
        chat[options.userAs] = [message.from.id];
      }
      promises.push(patchOrCreate(chat));
    }
    if(options.all && message.forward_from_chat)
      promises.push(patchOrCreate(message.forward_from_chat));
    return Promise.all(promises).then(() => hook);
  }
  return hook;
};
