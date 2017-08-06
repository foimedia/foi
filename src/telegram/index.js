const errors = require('feathers-errors');
const TelegramBot = require('node-telegram-bot-api');
const hooks = require('./hooks');
const Message = require('./message');

const init = function (config = {}) {
  const app = this;
  const _super = app.setup;
  const options = Object.assign({}, app.get('telegram') || {}, config);
  app.set('telegram', options);
  if(app.telegram) {
    throw new Error('You have already registered a Telegram Bot.');
  }
  if(!options.token) {
    throw new Error('You must provide a token for your bot.');
  }
  app.telegram = new TelegramBot(options.token, {polling: true});
  app.setup = function () {
    let result = _super.apply(this, arguments);
    return result;
  }
};

module.exports = Object.assign(init, {
  hooks,
  Message
});
