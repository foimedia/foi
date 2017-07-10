const users = require('./users/users.service.js');
const token = require('./token/token.service.js');
const chats = require('./chats/chats.service.js');
const media = require('./media/media.service.js');
const posts = require('./posts/posts.service.js');
const stories = require('./stories/stories.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(token);
  app.configure(chats);
  app.configure(media);
  app.configure(posts);
  app.configure(stories);
};
