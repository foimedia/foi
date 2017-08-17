// Initializes the `posts` service on path `/posts`
const createService = require('feathers-mongodb');
const hooks = require('./posts.hooks');
const filters = require('./posts.filters');
const telegram = require('./posts.telegram');
const validateStore = require('../../middleware/validate-store');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate, id: 'id' };

  app.use('/posts/validate_store', validateStore(app, {
    path: 'posts'
  }));

  // Initialize our service with any options it requires
  app.use('/posts', createService(options).extend({
    setup (app, path) {
      let result = this._super ? this._super.apply(this, arguments) : undefined;
      telegram(app, path);
      return result;
    }
  }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('posts');

  mongoClient.then(db => {
    service.Model = db.collection('posts');
  });

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
