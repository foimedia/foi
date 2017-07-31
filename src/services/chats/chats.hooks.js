const _ = require('lodash');
const errors = require('feathers-errors');
const { when, iffElse, discard, disallow } = require('feathers-hooks-common');
const { restrictToAuthenticated, restrictToOwner } = require('feathers-authentication-hooks');

const isPrivate = () => hook => {
  return hook.service.get(hook.id)
    .then(data => data.type == 'private');
}

const allMembersAreAdmin = () => hook => {
  return hook.service.get(hook.id)
    .then(data => !!data.all_members_are_administrators);
}

const isChatMember = () => hook => {
  const bot = hook.app.telegram.bot;
  const userId = hook.params.user.id;
  return bot.getChatMember(hook.id, userId)
    .then(() => hook)
    .catch(() => {
      throw new errors.Forbidden('You are not part of this chat.');
    });
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
      isChatMember()
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
          restrictToOwner({
            idField: 'id',
            ownerField: 'admins'
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
      disallow('external')
    ],
    update: [
      disallow('external')
    ],
    patch: [
      when(hook => hook.params.provider, [...restrict, parsePatch()])
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
