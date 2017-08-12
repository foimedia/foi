module.exports = function (data, connection, hook) {
  if(connection.chats && connection.chats.indexOf(data.chatId)) {
    return data;
  }
  if(connection.user && data.userId == connection.userId)
    return data;
  return false;
};
