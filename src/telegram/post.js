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
        .then(media.createMessageMedia)
        .then(createPost)
        .catch(err => {
          const chatId = data.chat.id;
          if(typeof err === 'string') {
            bot.sendMessage(chatId, err);
          } else {
            throw new errors.GeneralError(err);
          }
        });
    }
  };

  const createPost = message => {
    const post = message.toPost();
    if(post) {
      return service.create(post).then(() => {
        return message;
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
