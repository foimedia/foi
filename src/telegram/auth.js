module.exports = function () {

  const app = this;
  const bot = app.telegram.bot;
  const service = app.service('authorize');

  bot.onText(/\/start (.+)/, (message, match) => {
    const token = match[1];
    const chatId = message.chat.id;
    service.create({
      userId: message.from.id,
      userKey: token
    }).then(() => {
      bot.sendMessage(chatId, 'You are authenticated.');
    }).catch(() => {
      bot.sendMessage(chatId, 'Something went wrong, please try again.');
    });
  });

};
