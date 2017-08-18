module.exports = function (data, connection, hook) {
  if(
    data.id == connection.user.id ||
    connection.user.roles.indexOf('admin') !== -1
  ) return data;
  return false;
};
