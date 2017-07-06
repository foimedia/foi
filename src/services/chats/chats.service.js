// Initializes the `chats` service on path `/chats`
const createService = require('feathers-mongodb');
const hooks = require('./chats.hooks');
const filters = require('./chats.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate, id: 'id' };

  // Initialize our service with any options it requires
  app.use('/chats', createService(options));

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
