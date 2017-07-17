module.exports = function (data, connection, hook) {
  if(data.id == connection.payload.userId || connection.user.roles.indexOf('admin') !== -1) {
    return data;
  } else {
    return false;
  }
};
