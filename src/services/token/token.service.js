const hooks = require('./token.hooks');

module.exports = function () {

  const app = this;
  const passport = app.passport;
  const config = app.get('authentication');

  // Internal auth service
  const AuthService = {
    create (data, params) {
      const { user } = data;
      const payload = {
        user,
        key: data.userKey
      };
      return passport.createJWT(payload, config).then(accessToken => {
        return { accessToken };
      });
    }
  };

  app.use('/authorize', AuthService);

  const service = app.service('authorize');

  service.hooks(hooks);

  service.filter((data, connection, hook)  => {
    const { accessToken } = data;
    return app.passport.verifyJWT(accessToken, config).then(payload => {
      if(payload.key == connection.payload.key) {
        return { accessToken };
      } else {
        return false;
      }
    });
  });

};
