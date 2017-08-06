const errors = require('feathers-errors');

module.exports = (options = {}) => hook => {
  if(!hook.params.telegram) {
    throw new errors.Forbidden('You must perform this action through the Telegram bot.');
  }
  return hook;
}
