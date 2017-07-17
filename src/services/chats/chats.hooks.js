const errors = require('feathers-errors');
const { when, discard } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [
      // Fix integer ID
      hook => {
        hook.id = parseInt(hook.id);
        return hook;
      }
    ],
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
