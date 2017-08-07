const _ = require('lodash');
const errors = require('feathers-errors');
const { when, iff, iffElse, discard, disallow, setCreatedAt, setUpdatedAt } = require('feathers-hooks-common');
const { restrictToAuthenticated, restrictToOwner, restrictToRoles } = require('feathers-authentication-hooks');
const telegram = require('../../telegram').hooks;

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
      promises.push(storyService.remove(story.id).catch(() => hook));
    });
    return Promise.all(promises).then(() => hook);
  })
}

const isChatActivation = () => hook => {
  return hook.data.active !== undefined;
};

const parsePatch = () => hook => {
  hook.data = _.pick(hook.data, [
    'liveURL',
    'description',
    'archived',
    'active',
    'displayGallery'
  ]);
  return hook;
}

const restrict = [
  restrictToAuthenticated(),
  iffElse(
    allMembersAreAdmin(),
    [
      telegram.restrictToChatMember({
        userIdField: 'id',
        chatIdField: 'id'
      })
    ],
    [
      iffElse(
        telegram.isChatType('private'),
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
          telegram.restrictToChatAdmin({
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
      disallow(['rest', 'socketio']),
      setCreatedAt()
    ],
    update: [
      disallow(['rest', 'socketio']),
      setUpdatedAt()
    ],
    patch: [
      when(
        hook => hook.params.provider,
        [
          ...restrict,
          parsePatch(),
          iff(
            isChatActivation(),
            restrictToRoles({
              roles: 'publisher',
              idField: 'id'
            })
          )
        ]
      ),
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
    patch: [
      iff(isChatActivation(), hook => {
        hook.error = new errors.Forbidden('I\'m not authorized to publish content from this group! I must be invited by a publisher.');
        hook.error.leaveChat = true;
      })
    ],
    remove: []
  }
};
