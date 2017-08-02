const errors = require('feathers-errors');

module.exports = {
  before: {
    create: [
      // This is an internal service!
      hook => {
        if(hook.params.provider)
          throw new errors.Forbidden();
        return hook;
      },
      // Check userId req data
      hook => {
        if(!hook.data.userId) {
          throw new errors.BadRequest('You must provide an user id')
        }
        return hook;
      },
      // Parse userId to int
      hook => {
        hook.data.userId = parseInt(hook.data.userId);
        return hook;
      },
      // Fetch user
      hook => {
        const id = hook.data.userId;
        return hook.app.service('users').get(id).then(user => {
          hook.data.user = user;
          return hook;
        }).catch(err => {
          throw new errors.BadRequest(err);
        })
      }
    ],
    patch: [
      hook => {
        if(hook.data.authenticated) {
          hook.app.telegram.auth.validateIntent(hook.id);
        }
        return hook;
      }
    ]
  }
};
