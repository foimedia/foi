const errors = require('feathers-errors');
const Message = require('./message');
const User = require('./user');
const Chat = require('./chat');
const Media = require('./media');

module.exports = function () {

  const app = this;
  const bot = app.telegram.bot;
  const service = app.service('posts');

  app.configure(User);
  app.configure(Chat);
  app.configure(Media);

  const { user, chat, media } = app.telegram;

  const handleMessage = data => {
    const message = new Message(data);
    if(!message.isBotCommand()) {
      return chat.validateGroupInvite(message)
        .then(user.createMessageUsers)
        .then(chat.createMessageChats)
        .then(chat.validatePrivateChat)
        .then(chat.validateMuted)
        .then(media.createMessageMedia)
        .then(createPost)
        .catch(err => {
          const chatId = data.chat.id;
          if(typeof err === 'string') {
            bot.sendMessage(chatId, err);
          }
        });
    }
  };

  const createPost = message => {
    if(message !== undefined) {
      const post = message.toPost();
      if(post) {
        return service.create(post).then(() => message);
      } else {
        return Promise.resolve(message);
      }
    } else {
      return Promise.resolve(message);
    }
  };

  const updatePost = data => {
    const message = new Message(data);
    const post = message.toPost();
    if(post) {
      return service.get(post.id).then(() => {
        return service.patch(post.id, post);
      }).catch(() => {
        return handleMessage(data);
      });
    }
  };

  /*
   * Message received
   */
  bot.on('message', handleMessage);

  /*
   * Message edited
   */
  bot.on('edited_message', updatePost);

  return Object.assign(app.telegram || {}, {
    post: {
      handleMessage,
      createPost,
      updatePost
    }
  });

};
