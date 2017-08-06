const Message = require('../../telegram').Message;

module.exports = function(app, path) {
  const telegram = app.telegram;
  const service = app.service(path);

  const parse = (message, title = '') => {
    const story = {
      id: message.message_id,
      title: title,
      userId: message.from.id,
      chatId: message.chat.id,
      createdAt: message.getSentAt(),
      status: 'active'
    };
    return story;
  }

  /*
   * Start new story
   */
  telegram.onText(/\/story( .+)?/, (data, match) => {
    const chatId = data.chat.id;
    const message = new Message(data);
    const title = match[1].trim();
    service.create(parse(message, title), {
      telegram: true,
      message: message
    }).then(() => {
      telegram.sendMessage(chatId, `You just started your ${title ? title : 'new'} story!`);
    });
  });

  /*
   * Finish running story(ies)
   */
  telegram.onText(/\/endstory( .+)?/, (data) => {
    const chatId = data.chat.id;
    const message = new Message(data);
    service.find({
      query: {
        chatId: message.chat.id,
        userId: message.from.id,
        status: 'active'
      },
      paginate: false
    }).then(stories => {
      if(stories.length) {
        stories.forEach(story => {
          service.patch(story.id, {status: 'finished'}, {
            telegram: true,
            message: message
          }).then(() => {
            telegram.sendMessage(chatId, 'Your story is now finished.');
          });
        })
      } else {
        telegram.sendMessage(chatId, 'You have no running story.');
      }
    });
  });
};
