const errors = require('feathers-errors');
const { when, disallow } = require('feathers-hooks-common');
const { populateTelegramUser, patchOrCreateMessageUsers } = require('../../hooks/telegram');

const validateIntent = () => hook => {
  const intent = hook.service.intents[hook.id];
  if(intent !== undefined) {
    hook.service.remove(hook.id);
  } else {
    throw new errors.NotFound('Authentication intent not found.');
  }
}

module.exports = {
  before: {
    create: [
      disallow('external'),
      // Check token
      hook => {
        if(!hook.data.userKey)
          throw new errors.BadRequest('You must provide a valid token.');
      },
      // Parse userId to int
      hook => {
        hook.data.userId = parseInt(hook.data.userId);
        return hook;
      },
      // Fetch user
      hook => {
        const id = hook.data.userId;
        return hook.app.service('users').get(id).then(user => {
          hook.data.user = user;
          return hook;
        }).catch(err => {
          throw new errors.BadRequest(err);
        })
      }
    ],
    patch: [
      when(hook => hook.data.authenticated, validateIntent())
    ],
    remove: [
      disallow('external')
    ]
  },
  error: {
    all: hook => {
      const id = hook.id || hook.data.userId;
      if(id !== undefined && !isNaN(id))
        hook.app.telegram.bot.sendMessage(id, hook.error.message);
    },
    create: [
      hook => {
        if(!hook.data.userId) {
          hook.error = new errors.BadRequest('You must provide an user id')
        }
        return hook;
      }
    ]
  }
};
