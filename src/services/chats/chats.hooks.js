const _ = require('lodash');
const errors = require('feathers-errors');
const { when, iffElse, discard, disallow, setCreatedAt, setUpdatedAt } = require('feathers-hooks-common');
const { restrictToAuthenticated, restrictToOwner } = require('feathers-authentication-hooks');
const { restrictToChatMember, restrictToChatAdmin } = require('../../telegram').hooks;

const isPrivate = () => hook => {
  return hook.service.get(hook.id)
    .then(data => data.type == 'private');
}

const allMembersAreAdmin = () => hook => {
  return hook.service.get(hook.id)
    .then(data => !!data.all_members_are_administrators);
}

const removeStories = () => hook => {
  const storyService = hook.app.service('stories');
  const promises = [];
  return storyService.find({
    paginate: false,
    query: {
      chatId: hook.id
    }
  }).then(data => {
    data.forEach(story => {
      promises.push(storyService.remove(story.id));
    });
    return Promise.all(promises).then(() => hook);
  })
}

const parsePatch = () => hook => {
  hook.data = _.pick(hook.data, ['description', 'archived']);
  return hook;
}

const restrict = [
  restrictToAuthenticated(),
  iffElse(
    allMembersAreAdmin(),
    [
      restrictToChatMember({
        userIdField: 'id',
        chatIdField: 'id'
      })
    ],
    [
      iffElse(
        isPrivate(),
        [
          restrictToOwner({
            idField: 'id',
            ownerField: 'id'
          }),
          hook => {
            if(hook.method == 'remove') {
              throw new errors.Forbidden('You cannot delete a private chat.')
            } else {
              return hook;
            }
          }
        ],
        [
          restrictToChatAdmin({
            userIdField: 'id',
            chatIdField: 'id'
          })
        ]
      )
    ]
  )
];

const restrictProperties = [
  when(
    hook => hook.params.provider,
    [
      discard('_id'),
      discard('admins'),
      discard('all_members_are_administrators')
    ]
  )
];

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
      setCreatedAt()
    ],
    update: [
      disallow('external'),
      setUpdatedAt()
    ],
    patch: [
      when(hook => hook.params.provider, [...restrict, parsePatch()]),
      setUpdatedAt()
    ],
    remove: [
      when(hook => hook.params.provider, [...restrict]),
      removeStories()
    ]
  },

  after: {
    all: [...restrictProperties],
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
