const Message = require('./message');

module.exports = function () {

  const app = this;
  const bot = app.telegram.bot;
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

  /*
   * Start story
   */
  bot.onText(/\/story( .+)?/, (message, match) => {
    const chatId = message.chat.id;
    const title = match[1];
    const story = parse(message, title);
    service.create(story).then(data => {
      bot.sendMessage(chatId, 'You just started your "' + data.title.trim() + '" story!');
    }).catch(err => {
      bot.sendMessage(chatId, err.message);
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
