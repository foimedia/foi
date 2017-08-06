const _ = require('lodash');
const { authenticate } = require('feathers-authentication').hooks;
const { when, iff, discard, disallow, setCreatedAt, setUpdatedAt } = require('feathers-hooks-common');
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
  // Needs to parse nested properties patch
  // hook.data = _.pick(hook.data, ['chats']);
  // console.log(hook.data);
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
      firstUser(),
      setCreatedAt()
    ],
    update: [
      disallow('external'),
      setUpdatedAt()
    ],
    patch: [
      when(hook => hook.params.provider, parsePatch()),
      ...restrict,
      setUpdatedAt()
    ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      when(hook => hook.params.provider, [
        discard('_id'),
        discard('chats'),
        discard('language_code')
      ])
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
