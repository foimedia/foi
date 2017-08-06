module.exports = () => hook => {
  return hook.params.telegram && hook.params.message;
};
