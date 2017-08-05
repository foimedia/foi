const errors = require('feathers-errors');
const TelegramBot = require('node-telegram-bot-api');

module.exports = function () {

  const app = this;

  app.telegram = telegram = {};

  const config = app.get('telegram');

  const bot = telegram.bot = new TelegramBot(config.token, {polling: true});

};
