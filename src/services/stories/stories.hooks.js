const errors = require('feathers-errors');
const { iff, populate } = require('feathers-hooks-common');

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
