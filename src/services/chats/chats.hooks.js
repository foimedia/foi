const errors = require('feathers-errors');
const { when, discard } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [
      hook => {
        // console.log(hook.params);
        return hook;
      }
    ],
    find: [],
    get: [],
    create: [
      hook => {
        if(hook.params.provider)
          throw new errors.Forbidden('Chats can only be created internally');
        return hook;
      }
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      when(
        hook => hook.params.provider,
        discard('_id'),
        discard('users')
      )
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
