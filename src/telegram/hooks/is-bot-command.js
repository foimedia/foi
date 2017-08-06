const errors = require('feathers-errors');

module.exports = (config = {}) => hook => {
  if(!hook.params.telegram || !hook.params.message)
    throw new errors.MethodNotAllowed('This is not a telegram message.');
  const message = hook.params.message;
  return message.text && message.text.indexOf('/') === 0;
}
