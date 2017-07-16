module.exports = function () {

  const app = this;

  const service = app.service('users');

  function updateUser (user) {
    // bot.getUserProfilePhotos(user.id).then(data => {
    // console.log(data.photos[0]);
    // });
    return service.find({ query: { id: user.id } }).then(res => {
      if(res.data.length) {
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
    if(message.from)
      promises.push(updateUser(message.from));
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
