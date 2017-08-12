module.exports = function (data, connection, hook) {
  if(connection.user && data.users.some(id => id == connection.user.id))
    return data;
  if(connection.chats && connection.chats.indexOf(data.id) !== -1)
    return data;
  return false;
};
