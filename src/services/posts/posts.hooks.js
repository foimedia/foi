const errors = require('feathers-errors');
const { authenticate } = require('feathers-authentication').hooks;
const { iff, populate } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [
      hook => {
        console.log(hook.params);
        return hook;
      },
      authenticate('jwt')
    ],
    find: [],
    get: [],
    create: [
      (hook) => {
        if(hook.params.provider)
          throw new errors.Forbidden('Posts can only be created internally');
        return hook;
      }
    ],
    update: [
      (hook) => {
        if(hook.params.provider)
          throw new errors.Forbidden('Posts can only be updated internally');
        return hook;
      }
    ],
    patch: [
      (hook) => {
        if(hook.params.provider)
          throw new errors.Forbidden('Posts can only be patched internally');
        return hook;
      }
    ],
    remove: [
      (hook) => {
        if(hook.params.provider)
          throw new errors.Forbidden('Posts can only be removed internally');
        return hook;
      }
    ]
  },

  after: {
    all: [
      populate('media', {field: 'mediaId', service: 'media'}),
      populate('user', {field: 'userId', service: 'users'}),
      populate('creator', {field: 'creatorId', service: 'users'})
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
