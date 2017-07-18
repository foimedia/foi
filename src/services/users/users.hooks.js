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

const firstUser = () => hook => {
  return hook.service.find({$limit: 1}).then(users => {
    if(users.total <= 1) {
      hook.firstUser = true;
      hook.data.roles = ['admin', 'publisher'];
    }
    return hook;
  });
};

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
    create: [ firstUser(), ],
    update: [ firstUser(), ...restrict ],
    patch: [ firstUser(), ...restrict ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      discard('_id'),
      discard('chats')
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
