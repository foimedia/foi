const Message = require('feathers-telegram-bot').Message;

module.exports = function (app, path) {
  const telegram = app.telegram;
  const service = app.service(path);

  /*
   * Archive chat
   */
  telegram.onText(/\/archive( .+)?/, message => {
    const chatId = message.chat.id;
    const userId = message.from.id;
    service.patch(chatId, {
      archived: true
    }, {
      telegram: true,
      message: message
    }).then(() => {
      telegram.sendMessage(chatId, 'This chat has been archived.');
    });
  });

  /*
   * Unarchive chat
   */
  telegram.onText(/\/unarchive( .+)?/, message => {
    const chatId = message.chat.id;
    const userId = message.from.id;
    service.patch(chatId, {
      archived: false
    }, {
      telegram: true,
      message: message
    }).then(() => {
      telegram.sendMessage(chatId, 'This chat has been unarchived.');
    });
  });

  /*
   * Group invites
   */
  function isGroupInvite (message) {
    if(message.group_chat_created) {
      return true;
    } else if(message.new_chat_members) {
      let isBotInvite = false;
      message.new_chat_members.forEach(member => {
        if(member.username == app.get('telegram').username) {
          isBotInvite = true;
        }
      });
      return isBotInvite;
    } else {
      return false;
    }
  }
  telegram.on('message', data => {
    const message = new Message(data);
    const chatId = message.chat.id;
    if(isGroupInvite(message)) {
      service.patch(chatId, {
        active: true
      }, {
        telegram: true,
        message: message
      }).then(() => {
        telegram.sendMessage(chatId, 'I\'m ready to start publishing content from this group!');
      });
    }
  });
};
