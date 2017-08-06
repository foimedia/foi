const Message = require('../../telegram').Message;

module.exports = function(app, path) {
  const telegram = app.telegram;
  const service = app.service(path);

  /*
   * New message
   */
  telegram.on('message', data => {
    const message = new Message(data);
    if(!message.isBotCommand()) {
      const post = message.toPost();
      if(post) {
        service.create(post, {
          telegram: true,
          message: message
        })
      }
    }
  });

  /*
   * Edited message
   */
  telegram.on('edited_message', data => {
    const message = new Message(data);
    const post = message.toPost();
    if(post) {
      service.get(post.id).then(() => {
        service.patch(post.id, post, {
          telegram: true,
          message: message
        });
      }).catch(() => {
        service.create(post, {
          telegram: true,
          message: message
        });
      });
    }
  });
};
