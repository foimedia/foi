// Initializes the `stories` service on path `/stories`
const createService = require('feathers-mongodb');
const hooks = require('./stories.hooks');
const filters = require('./stories.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate, id: 'id' };

  // Initialize our service with any options it requires
  app.use('/stories', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('stories');

  mongoClient.then(db => {
    service.Model = db.collection('stories');
  });

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
