// Initializes the `stories` service on path `/stories`
const createService = require('feathers-mongodb');
const hooks = require('./stories.hooks');
const filters = require('./stories.filters');
const telegram = require('./stories.telegram');
const validateStore = require('../../middleware/validate-store');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate, id: 'id' };

  app.use('/stories/validate_store', validateStore(app, {
    path: 'stories'
  }));

  // Initialize our service with any options it requires
  app.use('/stories', createService(options).extend({
    setup (app, path) {
      let result = this._super ? this._super.apply(this, arguments) : undefined;
      telegram(app, path);
      return result;
    }
  }));

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
