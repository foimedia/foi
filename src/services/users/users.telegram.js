module.exports = function (app, path) {
  const telegram = app.telegram;
  const service = app.service(path);

  /*
   * Mute chat
   */
  telegram.onText(/\/mute( .+)?/, message => {
    const chatId = message.chat.id;
    const userId = message.from.id;
    service.patch(userId, {
      [`chats.${chatId}.muted`]: true
    }, {
      telegram: true,
      message: message
    }).then(() => {
      telegram.sendMessage(chatId, 'You are now muted on this chat.');
    });
  });

  /*
   * Unmute chat
   */
  telegram.onText(/\/unmute( .+)?/, message => {
    const chatId = message.chat.id;
    const userId = message.from.id;
    service.patch(userId, {
      [`chats.${chatId}.muted`]: false
    }, {
      telegram: true,
      message: message
    }).then(() => {
      telegram.sendMessage(chatId, 'You are not muted anymore.');
    });
  });
}
