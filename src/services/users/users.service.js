// Initializes the `users` service on path `/users`
const createService = require('feathers-mongodb');
const hooks = require('./users.hooks');
const filters = require('./users.filters');
const telegram = require('./users.telegram');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate, id: 'id' };

  // Initialize our service with any options it requires
  app.use('/users', createService(options).extend({
    setup (app, path) {
      let result = this._super ? this._super.apply(this, arguments) : undefined;
      telegram(app, path);
      return result;
    }
  }));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('users');

  mongoClient.then(db => {
    service.Model = db.collection('users');
  });

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }

};
