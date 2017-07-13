const errors = require('feathers-errors');
const Message = require('./message');
const user = require('./user');
const chat = require('./chat');
const media = require('./media');

module.exports = function () {

  const app = this;
  const bot = app.telegram.bot;
  const service = app.service('posts');

  app.configure(user);
  app.configure(chat);
  app.configure(media);

  const createPost = data => {
    const message = new Message(data);
    const post = message.toPost();
    const { user, chat, media } = app.telegram;
    if(post) {
      return user.createMessageUsers(message)
        .then(() => chat.createMessageChats(message))
        .then(() => media.createMessageMedia(message))
        .then(() => service.create(post))
        .catch(err => {
          throw new errors.GeneralError(err);
        });
    }
  };

  const updatePost = data => {
    const message = new Message(data);
    const post = message.toPost();
    if(post) {
      service.get(post.id).then(() => {
        service.patch(post.id, post);
      }).catch(() => {
        createPost(data);
      });
    }
  }

  /*
   * Message received
   */
  bot.on('message', createPost);

  /*
   * Message edited
   */
  bot.on('edited_message', updatePost);

  return Object.assign(app.telegram || {}, {
    post: {
      createPost,
      updatePost
    }
  });

};
