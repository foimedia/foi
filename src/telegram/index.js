const errors = require('feathers-errors');
const TelegramBot = require('node-telegram-bot-api');

const post = require('./post');
const auth = require('./auth');
const story = require('./story');

module.exports = function () {

  const app = this;

  const config = app.get('telegram');

  // Create bot and assign to app
  const bot = new TelegramBot(config.token, {polling: true});

  app.telegram = Object.assign(app.telegram || {}, {
    bot
  });

  app.configure(auth);
  app.configure(post);
  app.configure(story);

};
