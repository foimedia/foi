const _ = require('lodash');

module.exports = function () {

  const app = this;

  const service = app.service('users');

  function updateUser (user) {
    // bot.getUserProfilePhotos(user.id).then(data => {
    // console.log(data.photos[0]);
    // });
    return service.find({ query: { id: user.id } }).then(res => {
      if(res.data.length) {
        user.chats = _.union(user.chats, res.data[0].chats || []);
        return service.patch(user.id, user);
      } else {
        return service.create(user);
      }
    });
  }

  function hasRole (user, role) {
    return Array.isArray(user.roles) && user.roles.indexOf(role) !== -1;
  }

  function isPublisher (user) {
    return hasRole(user, 'publisher');
  }

  function isAdmin (user) {
    return hasRole(user, 'admin');
  }

  function createMessageUsers (message) {
    let promises = [];
    if(message.from) {
      const user = Object.assign({
        chats: []
      }, message.from);
      if(message.chat.type !== 'private') {
        user.chats.push(message.chat.id);
      }
      promises.push(updateUser(user));
    }
    if(message.forward_from)
      promises.push(updateUser(message.forward_from));
    return Promise.all(promises).then(() => {
      return message;
    });
  }

  return Object.assign(app.telegram || {}, {
    user: {
      hasRole,
      isAdmin,
      isPublisher,
      updateUser,
      createMessageUsers
    }
  });

};
