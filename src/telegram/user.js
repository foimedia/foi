module.exports = function (app) {

  const service = app.service('users');

  function updateUser (user) {
    // bot.getUserProfilePhotos(user.id).then(data => {
    //   // console.log(data.photos[0]);
    // });
    let promises = [];
    service.find({ query: { id: user.id } }).then(res => {
      if(res.data.length) {
        promises.push(service.patch(user.id, user));
      } else {
        promises.push(service.create(user));
      }
    });
    return Promise.all(promises);
  }

  function createMessageUsers (msg) {
    let promises = [];
    if(msg.from)
      promises.push(updateUser(msg.from));
    if(msg.forward_from)
      promises.push(updateUser(msg.forward_from));
    return Promise.all(promises);
  }

  return {
    updateUser,
    createMessageUsers
  }

};
