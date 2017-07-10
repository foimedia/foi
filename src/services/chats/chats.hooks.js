const errors = require('feathers-errors');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      (hook) => {
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
    all: [],
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
