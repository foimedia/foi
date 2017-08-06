const errors = require('feathers-errors');
const { authenticate } = require('feathers-authentication').hooks;
const { when, populate, discard, disallow, setCreatedAt, setUpdatedAt } = require('feathers-hooks-common');
const { restrictChatContent } = require('../../hooks/chat-restrictions');
const { isTelegram } = require('../../telegram').hooks;
const Message = require('../../telegram').Message;

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

const createMedia = (service, file) => {
  return service.find({
    query: {
      file_id: file.file_id
    }
  }).then(res => {
    if(res.data.length) {
      return Promise.resolve();
    } else {
      return service.create(file);
    }
  });
};

const createMessageMedia = () => hook => {
  const mediaService = hook.app.service('media');
  let message = hook.params.message;
  if(!(message instanceof Message)) {
    message = new Message(message);
  }
  const type = message.getType();
  let promises = [];
  if(type !== undefined) {
    const media = message[type];
    if(typeof media !== 'string') {
      if(Array.isArray(media) && media[0].file_id) {
        media.forEach(file => {
          promises.push(createMedia(mediaService, file));
          if(file.thumb) {
            promises.push(createMedia(mediaService, file.thumb));
          }
        });
      } else if(media.file_id) {
        promises.push(createMedia(mediaService, media));
        if(media.thumb) {
          promises.push(createMedia(mediaService, media.thumb));
        }
      }
    }
  }
  return Promise.all(promises).then(() => hook);
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
      disallow(['rest', 'socketio']),
      ...restrictChatContent,
      when(isTelegram(), createMessageMedia()),
      assignToStory()
    ],
    update: [
      disallow('external')
    ],
    patch: [
      disallow(['rest', 'socketio'])
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
    create: [
      hook => {
        if(hook.error.message == 'You do not have valid permissions to access this.') {
          hook.error = new errors.Forbidden(`You do not have valid permissions to create a post.`);
        }
        return hook;
      }
    ],
    update: [],
    patch: [],
    remove: []
  }
};
