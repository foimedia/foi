const errors = require('feathers-errors');

module.exports = (options = {}) => hook => {
  if(hook.type !== 'before') {
    throw new Error(`The 'restrictToChatAdmin' hook should only be used as a 'before' hook.`);
  }
  if(hook.params.telegram) {
    const message = hook.params.message;
    if(message.chat.type == 'private' || message.chat.all_members_are_administrators) {
      return hook;
    } else {
      return hook.app.telegram.getChatAdministrators(message.chat.id).then(admins => {
        const ids = admins.map(admin => admin.user.id);
        if(ids.indexOf(message.from.id) === -1) {
          throw new errors.Forbidden('You must be a chat admin to perform this action');
        }
        return hook;
      })
    }
  }
}
