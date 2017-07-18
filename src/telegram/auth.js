const Message = require('./message');

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

  bot.onText(/\/start (.+)/, (data, match) => {
    const chatId = data.chat.id;
    const message = new Message(data);
    return user.createMessageUsers(message)
      .then(chat.createMessageChats)
      .then(user.validatePrivateChat)
      .then(() => createToken(message, match))
      .then(data => {
        bot.sendMessage(chatId, 'You are authenticated.');
      })
      .catch(err => {
        bot.sendMessage(chatId, err.message || err);
      })
  });

};
