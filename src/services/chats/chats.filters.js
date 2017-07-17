module.exports = function (data, connection, hook) {
  if(data.users.indexOf(connection.payload.userId) !== -1) {
    return data;
  } else {
    return false;
  }
};
