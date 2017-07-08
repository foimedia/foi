module.exports = function () {

  const app = this;
  const bot = app.telegram.bot;
  const service = app.service('authorize');

  bot.onText(/\/start (.+)/, (msg, match) => {
    const token = match[1];
    const chatId = msg.chat.id;
    service.create({
      userId: msg.from.id,
      userKey: token
    }).then(() => {
      bot.sendMessage(chatId, 'You are authenticated.');
    }).catch(() => {
      bot.sendMessage(chatId, 'Something went wrong, please try again.');
    });
  });

};
