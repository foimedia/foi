const errors = require('feathers-errors');
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
          throw new errors.Forbidden('Stories can only be created internally');
        return hook;
      },
      // Users can only have 1 running story
      hook => {
        return hook.service.find({
          query: {
            userId: hook.data.userId,
            status: 'active'
          }
        }).then(res => {
          if(res.data.length) {
            throw new errors.Forbidden('You can only have one running story. Maybe you\'d like to /endstory before starting a new one?');
          } else {
            return hook;
          }
        });
      }
    ],
    update: [],
    patch: [],
    remove: []
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
              provider: undefined
            },
            {
              nameAs: 'posts',
              service: 'posts',
              parentField: 'id',
              childField: 'storyId',
              asArray: true,
              paginate: false,
              query: {
                $sort: {
                  sentAt: 1
                }
              }
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
