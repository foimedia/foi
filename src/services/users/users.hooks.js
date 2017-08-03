const { authenticate } = require('feathers-authentication').hooks;
const { when, iff, discard, disallow } = require('feathers-hooks-common');
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
    if(users.total === 0) {
      hook.firstUser = true;
      hook.data.roles = ['admin', 'publisher'];
    }
    return hook;
  });
};

const defaultRoles = () => hook => {
  if(!hook.data.role) {
    hook.data.roles = hook.app.get('defaultUserRoles') || [];
  }
  return hook;
}

const parsePatch = () => hook => {
  // hook.data = _.pick(hook.data, ['']);
  hook.data = {}; // currently no data is going to be patched
  return hook;
}

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
      disallow('external'),
      defaultRoles(),
      firstUser()
    ],
    update: [ disallow('external') ],
    patch: [ parsePatch(), ...restrict ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      discard('_id'),
      discard('chats'),
      discard('language_code')
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
