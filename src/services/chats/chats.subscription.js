module.exports = function subscribe(app, service) {
  app.io.on('connection', socket => {
    socket.on('chats::get', chatId => {
      let { chats } = socket.feathers;
      chats = chats || [];
      chats.push(chatId);
      socket.feathers.chats = chats;
    });
  });
}
