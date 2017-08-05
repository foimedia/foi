module.exports = (options = {}) => hook => {
  options = Object.assign({
    telegramIdField: 'telegramId'
  }, hook.app.get('authentication'), options);
  if(hook.type !== 'before') {
    throw new Error(`The telegram 'authenticate' hook should only be used as a 'before' hook.`);
  }
  if(!options.service) {
    throw new Error(`The telegram 'authenticate' hook requires an user service.`);
  }
  if(hook.params.telegram) {
    const id = hook.params.message.from.id;
    return hook.app.service(options.service).find({
      query: {
        [options.telegramIdField]: id,
      },
      paginate: false
    }).then(data => {
      hook.params = Object.assign(
        { authenticated: true },
        hook.params,
        { user: data[0] }
      );
      return hook;
    });
  }
  return hook;
};
