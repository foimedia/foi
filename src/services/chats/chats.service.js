// Initializes the `chats` service on path `/chats`
const createService = require('feathers-mongodb');
const hooks = require('./chats.hooks');
const filters = require('./chats.filters');
const telegram = require('./chats.telegram');
const subscription = require('./chats.subscription');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate, id: 'id' };

  // Initialize our service with any options it requires
  app.use('/chats', createService(options).extend({
    setup (app, path) {
      let result = this._super ? this._super.apply(this, arguments) : undefined;
      telegram(app, path);
      // Socket chat subscription
      if(app.io) {
        subscription(app, this);
      }
      return result;
    }
  }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('chats');

  mongoClient.then(db => {
    service.Model = db.collection('chats');
  });

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
