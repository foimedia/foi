module.exports = function (app) {

  const service = app.service('chats');

  function updateChat (chat) {
    return service.find({ query: { id: chat.id } }).then(res => {
      if(res.data.length) {
        service.patch(chat.id, chat);
      } else {
        service.create(chat);
      }
    });
  }

  function createMessageChats (msg) {
    let promises = [];
    if(msg.chat)
      promises.push(updateChat(msg.chat));
    if(msg.forwarded_from_chat)
      promises.push(updateChat(msg.forwarded_from_chat));
    return Promise.all(promises);
  }

  return {
    createMessageChats
  };

};
