const authentication = require('feathers-authentication');
const jwt = require('feathers-authentication-jwt');

const _ = require('lodash');
const crypto = require('crypto');
const AnonymousStrategy = require('passport-anonymous').Strategy;

const generateToken = () => {
  return crypto.randomBytes(6).toString('hex').toUpperCase();
};

const anonymous = function() {
  return function anonymousAuth() {
    const app = this;
    const _super = app.setup;
    if (!app.passport) {
      throw new Error(`Can not find app.passport.`);
    }
    app.setup = function() {
      let result = _super.apply(this, arguments);
      app.passport.use('anonymous', new AnonymousStrategy());
      return result;
    }
  }
};

module.exports = function () {
  const app = this;
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(anonymous());

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies),
        hook => {
          if(hook.data.strategy == 'anonymous') {
            // make sure params.payload exists
            hook.params.payload = hook.params.payload || {};
            // clear user and key if coming from authorized session
            if(hook.params.payload.userId) {
              delete hook.params.payload.userId;
              delete hook.params.payload.key;
              delete hook.params.user;
              delete hook.params.data;
            }
            // merge in `key` token property
            if(!hook.params.payload.key) {
              Object.assign(hook.params.payload, {key: generateToken()});
            }
          }
          return hook;
        }
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    },
    after: {
      create: [
        hook => {
          hook.result.token = hook.params.payload.key || hook.params.token;
          if(!_.isEmpty(hook.params.user)) {
            hook.result.data = hook.params.user;
          } else {
            hook.result.data = {anonymous: true};
          }
          return hook;
        }
      ]
    }
  });


};
