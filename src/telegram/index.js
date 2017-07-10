const errors = require('feathers-errors');
const token = process.env.TELEGRAM_TOKEN || false;
const TelegramBot = require('node-telegram-bot-api');

const post = require('./post');
const auth = require('./auth');
const story = require('./story');

module.exports = function () {

  const app = this;

  // Create bot and assign to app
  const bot = new TelegramBot(token, {polling: true});

  app.telegram = Object.assign(app.telegram || {}, {
    bot
  });

  app.configure(auth);
  app.configure(post);
  app.configure(story);

};
