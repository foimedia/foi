const errors = require('feathers-errors');
const token = process.env.TELEGRAM_TOKEN || false;
const TelegramBot = require('node-telegram-bot-api');

const telegramAuth = require('./auth');

const telegramUser = require('./user');
const telegramChat = require('./chat');
const telegramMedia = require('./media');
const telegramPost = require('./post');

module.exports = function () {

  const app = this;

  // Create bot and assign to app
  const bot = app.bot = new TelegramBot(token, {polling: true});

  const postService = app.service('posts');

  const User = telegramUser(app);
  const Chat = telegramChat(app);
  const Media = telegramMedia(app);
  const Post = telegramPost(app);

  const Auth = telegramAuth(app);

  const createPost = msg => {
    const post = Post.parse(msg);
    if(post) {
      return User.createMessageUsers(msg)
        .then(() => Chat.createMessageChats(msg))
        .then(() => Media.createPostMedia(post))
        .then(() => postService.create(post))
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
  bot.on('edited_message', msg => {
    const post = Post.parse(msg);
    if(post) {
      postService.get(post.id).then(data => {
        postService.patch(post.id, post);
      }).catch(() => {
        createPost(msg);
      });
    }
  });

  /*
   * Start story
   */
  bot.onText(/\/story (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const args = match[1];
    bot.sendMessage(chatId, args);
  });

  return bot;

};
