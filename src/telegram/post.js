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

  const parse = data => {
    const message = new Message(data);
    const type = message.getType();
    if(type !== undefined && !message.isBotCommand()) {
      const post = {
        id: message.message_id,
        sentAt: message.getSentAt(),
        creatorSentAt: message.getCreatorSentAt(),
        editedAt: message.getEditedAt(),
        type: type,
        content: message[type],
        mediaId: message[type].file_id,
        userId: message.from.id,
        chatId: message.chat.id,
        creatorId: message.getCreator()
      };
      return post;
    }
    return false;
  };

  const createPost = message => {
    const post = parse(message);
    const { user, chat, media } = app.telegram;
    if(post) {
      return user.createMessageUsers(message)
        .then(() => chat.createMessageChats(message))
        .then(() => media.createPostMedia(post))
        .then(() => service.create(post))
        .catch(err => {
          throw new errors.GeneralError(err);
        });
    }
  };

  /*
   * Message received
   */
  bot.on('message', createPost);

  /*
   * Message edited
   */
  bot.on('edited_message', message => {
    const post = parse(message);
    if(post) {
      service.get(post.id).then(data => {
        service.patch(post.id, post);
      }).catch(() => {
        createPost(message);
      });
    }
  });

  return Object.assign(app.telegram || {}, {
    post: {
      parse
    }
  });

};
