// Initializes the `media` service on path `/media`
const createService = require('feathers-mongodb');
const hooks = require('./media.hooks');
const filters = require('./media.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate, id: 'file_id' };

  // Initialize our service with any options it requires
  app.use('/media', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('media');

  mongoClient.then(db => {
    service.Model = db.collection('media');
  });

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
