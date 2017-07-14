const { authenticate } = require('feathers-authentication').hooks;
const { when, iff, discard } = require('feathers-hooks-common');
const { restrictToOwner } = require('feathers-authentication-hooks');

const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: 'id',
    ownerField: 'id'
  })
];

module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [
      // Fix integer ID
      hook => {
        hook.id = parseInt(hook.id);
        return hook;
      }
    ],
    create: [ discard('token') ],
    update: [ discard('token'), ...restrict ],
    patch: [ discard('token'), ...restrict ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      when(
        hook => hook.params.provider,
        discard('password'),
        discard('token')
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
