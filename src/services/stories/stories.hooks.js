const errors = require('feathers-errors');
const { iff, populate } = require('feathers-hooks-common');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
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
      populate('user', {field: 'userId', service: 'users'}),
      populate({
        schema: {
          include: {
            service: 'posts',
            nameAs: 'posts',
            parentField: 'id',
            childField: 'storyId',
          }
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
