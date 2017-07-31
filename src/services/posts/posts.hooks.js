const errors = require('feathers-errors');
const { authenticate } = require('feathers-authentication').hooks;
const { when, populate, discard, disallow } = require('feathers-hooks-common');

const assignToStory = () => hook => {
  const storyService = hook.app.service('stories');
  return storyService.find({
    query: {
      userId: hook.data.userId,
      status: 'active'
    }
  }).then(res => {
    if(res.data.length) {
      hook.data.storyId = res.data[0].id;
    } else {
      hook.data.storyId = hook.data.id;
    }
    return hook;
  });
};

const createPostStory = () => hook => {
  const storyService = hook.app.service('stories');
  if(hook.result.id == hook.result.storyId) {
    // Create single-post story
    storyService.create({
      id: hook.result.id,
      title: '',
      userId: hook.result.userId,
      chatId: hook.result.chatId,
      createdAt: hook.result.sentAt,
      status: 'finished'
    });
  }
  return hook;
};

const removeMedia = () => hook => {
  const mediaService = hook.app.service('media');
  return hook.service.get(hook.id).then(data => {
    const promises = [];
    if(data.mediaId) {
      const media = Array.isArray(data.mediaId) ? data.mediaId : [data.mediaId];
      media.forEach(mediaId => {
        promises.push(mediaService.remove(mediaId));
      });
    }
    return Promise.all(promises).then(() => hook);
  });
};

module.exports = {
  before: {
    all: [
      // Parse int
      hook => {
        if(hook.params.query && hook.params.query.chatId) {
          hook.params.query.chatId = parseInt(hook.params.query.chatId);
        }
        if(hook.params.query && hook.params.query.userId) {
          hook.params.query.userId = parseInt(hook.params.query.userId);
        }
        return hook;
      }
    ],
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
      assignToStory()
    ],
    update: [
      disallow('external')
    ],
    patch: [
      disallow('external')
    ],
    remove: [
      disallow('external'),
      removeMedia()
    ]
  },

  after: {
    all: [
      when(
        hook => hook.params.provider,
        discard('_id')
      ),
      populate({
        schema: {
          include: [
            {
              nameAs: 'user',
              service: 'users',
              parentField: 'userId',
              childField: 'id',
              useInnerPopulate: true
            },
            {
              nameAs: 'creator',
              service: 'users',
              parentField: 'creatorId',
              childField: 'id',
              useInnerPopulate: true
            },
            {
              nameAs: 'media',
              service: 'media',
              parentField: 'mediaId',
              childField: 'file_id',
              asArray: true,
              useInnerPopulate: true
            }
          ]
        }
      })
    ],
    find: [],
    get: [],
    create: [
      createPostStory()
    ],
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
