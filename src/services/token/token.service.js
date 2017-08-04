const AUTH_INTENT_TIMEOUT = 10; // in seconds

const hooks = require('./token.hooks');

module.exports = function () {

  const app = this;
  const telegram = app.telegram;
  const bot = telegram.bot;
  const passport = app.passport;
  const config = app.get('authentication');

  // Internal auth service
  const AuthService = {
    timeout: AUTH_INTENT_TIMEOUT * 1000,
    intents: {},
    create (data, params) {
      const { user } = data;
      const payload = {
        userId: user.id,
        key: data.userKey
      };
      return passport.createJWT(payload, config).then(accessToken => {
        this.intents[user.id] = Date.now();
        bot.sendMessage(user.id, 'Waiting for browser response...', {
          disable_notification: true
        });
        bot.sendChatAction(user.id, 'typing');
        return { accessToken };
      });
    },
    patch (id, data, params) {
      if(data.authenticated) {
        bot.sendMessage(id, 'You are authenticated! You can go back to your browser now.');
      }
      return true;
    },
    remove (id) {
      delete this.intents[id];
      return this.intents;
    },
    flush () {
      const now = Date.now();
      for(let id in this.intents) {
        if(this.intents[id] + this.timeout < now) {
          this.remove(id);
          bot.sendMessage(id, 'No browser response, authentication timed out. Refresh your browser page and try again.');
        }
      }
    },
    setup () {
      setInterval(this.flush.bind(this), this.timeout/2);
    }
  };

  app.use('/authorize', AuthService);

  const service = app.service('authorize');

  service.hooks(hooks);

  service.filter((data, connection, hook) => {
    const { accessToken } = data;
    return app.passport.verifyJWT(accessToken, config).then(payload => {
      if(payload.key == connection.payload.key) {
        return { accessToken };
      } else {
        return false;
      }
    });
  });

  bot.onText(/\/start ([a-zA-Z0-9]{12})/, (data, match) => {
    service.create({
      userId: data.from.id,
      userKey: match[1],
    });
  });

};
