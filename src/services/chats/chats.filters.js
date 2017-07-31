module.exports = function (data, connection, hook) {
  if(data.users.indexOf(connection.user.id) !== -1) {
    return data;
  } else {
    return false;
  }
};
