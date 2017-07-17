const Message = require('./message');

module.exports = function () {

  const app = this;
  const { bot, chat } = app.telegram;
  const service = app.service('stories');

  const parse = (data, title = '') => {
    const message = new Message(data);
    const story = {
      id: message.message_id,
      title: title.trim(),
      userId: message.from.id,
      createdAt: message.getSentAt(),
      status: 'active'
    };
    return story;
  };

  function createStory (message, match) {
    return service.create(parse(message, match[1]));
  }

  /*
   * Start story
   */
  bot.onText(/\/story( .+)?/, (data, match) => {
    const chatId = data.chat.id;
    const message = new Message(data);
    return chat.validatePrivateChat(message)
      .then(() => createStory(message, match))
      .then(data => {
        bot.sendMessage(chatId, 'You just started your "' + data.title.trim() + '" story!');
      })
      .catch(err => {
        bot.sendMessage(chatId, err.message || err);
      });
  });

  /*
   * End story
   */
  bot.onText(/\/endstory( .+)?/, (message, match) => {
    const chatId = message.chat.id;
    service.find({
      query: {
        userId: message.from.id,
        status: 'active'
      }
    }).then(res => {
      if(res.data.length) {
        res.data.forEach(story => {
          service.patch(story.id, {status: 'finished'}).then(() => {
            bot.sendMessage(chatId, 'Your story is now finished.');
          }).catch(err => {
            bot.sendMessage(chatId, err.message);
          });
        })
      } else {
        bot.sendMessage(chatId, 'You have no running story.');
      }
    });
  });

};
