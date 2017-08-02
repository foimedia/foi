const Message = require('./message');
const AUTH_INTENT_TIMEOUT = 10; // in seconds

module.exports = function () {

  const app = this;
  const { bot, chat, user } = app.telegram;
  const service = app.service('authorize');

  const createToken = (message, match) => {
    const token = match[1];
    return service.create({
      userId: message.from.id,
      userKey: token
    });
  };

  const intents = {};

  const timeout = AUTH_INTENT_TIMEOUT * 1000;

  const createIntent = id => {
    intents[id] = Date.now();
    return intents[id];
  }

  const removeIntent = id => {
    delete intents[id];
    return intents;
  }

  const flushIntents = () => {
    const now = Date.now();
    for(let id in intents) {
      if(intents[id] + timeout < now) {
        removeIntent(id);
        bot.sendMessage(id, 'No browser response, authentication timed out. Try refreshing your browser page and try again.');
      }
    }
  }

  const validateIntent = id => {
    const intent = intents[id];
    if(intent !== undefined) {
      removeIntent(id);
      bot.sendMessage(id, 'You are authenticated! You can go back to your browser now.');
    }
  }

  setInterval(flushIntents, timeout/2);

  bot.onText(/\/start ([a-zA-Z0-9]{12})/, (data, match) => {
    const chatId = data.chat.id;
    const message = new Message(data);
    return user.createMessageUsers(message)
      .then(chat.createMessageChats)
      .then(chat.validatePrivateChat)
      .then(() => createToken(message, match))
      .then(data => {
        createIntent(chatId);
        bot.sendMessage(chatId, 'Waiting for browser response...');
      })
      .catch(err => {
        bot.sendMessage(chatId, err.message || err);
      })
  });

  return Object.assign(app.telegram || {}, {
    auth: {
      validateIntent
    }
  })

};
