module.exports = (options = {}) => hook => {
  options = Object.assign({
    telegramIdField: 'telegramId',
    as: 'telegram',
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
        const props = Object.keys(user);
        const changed = props.some(prop => (
          JSON.stringify(data[0][prop]) != JSON.stringify(user[prop])
        ));
        if(changed) {
          return service.patch(data[0][service.id], userData);
        } else {
          return Promise.resolve(data[0]);
        }
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
};
