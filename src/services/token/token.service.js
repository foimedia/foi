const AUTH_INTENT_TIMEOUT = 6; // in seconds

const crypto = require("crypto");

const hooks = require("./token.hooks");
const telegram = require("./token.telegram");

const generateToken = () => {
  return crypto
    .randomBytes(6)
    .toString("hex")
    .toUpperCase();
};

module.exports = function() {
  const app = this;
  const passport = app.passport;
  const config = app.get("authentication");

  // Internal auth service
  const AuthService = {
    timeout: AUTH_INTENT_TIMEOUT * 1000,
    create(data, params) {
      const { user } = data;
      const payload = {
        userId: user.id,
        key: data.userKey
      };
      return passport.createJWT(payload, config).then(accessToken => {
        this.intents[user.id] = Date.now();
        return { accessToken };
      });
    },
    patch(id, data, params) {
      return id;
    },
    remove(id, params) {
      delete this.intents[id];
      return this.intents;
    },
    flush(path) {
      const service = app.service(path);
      return function() {
        const now = Date.now();
        for (let id in this.intents) {
          if (this.intents[id] + this.timeout < now) {
            service.remove(id);
          }
        }
      };
    },
    setup(app, path) {
      const service = app.service(path);
      this.intents = {};
      setInterval(this.flush(path).bind(this), this.timeout / 2);
      if (app.io) {
        app.io.on("connection", socket => {
          const key = generateToken();
          socket.feathers.key = key;
          socket.emit("key", key);
        });
      }
      telegram(app, path);
    }
  };

  app.use("/authorize", AuthService);

  const service = app.service("authorize");

  service.hooks(hooks);

  service.filter((data, connection, hook) => {
    const { accessToken } = data;
    return app.passport.verifyJWT(accessToken, config).then(payload => {
      if (payload.key == connection.key) {
        return { accessToken };
      }
      return false;
    });
  });
};
