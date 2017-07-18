const errors = require('feathers-errors');
const { authenticate } = require('feathers-authentication').hooks;
const { when, populate, discard } = require('feathers-hooks-common');

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
      hook => {
        if(hook.params.provider)
          throw new errors.Forbidden('Posts can only be created internally');
        return hook;
      },
      // Assign to story
      hook => {
        const storyService = hook.app.service('stories');
        return storyService.find({
          query: {
            userId: hook.data.userId,
            status: 'active'
          }
        }).then(res => {
          if(res.data.length) {
            hook.data.storyId = res.data[0].id;
          }
          return hook;
        }).catch(res => {
          return hook;
        });
      }
    ],
    update: [
      hook => {
        if(hook.params.provider)
          throw new errors.Forbidden('Posts can only be updated internally');
        return hook;
      }
    ],
    patch: [
      hook => {
        if(hook.params.provider)
          throw new errors.Forbidden('Posts can only be patched internally');
        return hook;
      }
    ],
    remove: [
      hook => {
        if(hook.params.provider)
          throw new errors.Forbidden('Posts can only be removed internally');
        return hook;
      }
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
