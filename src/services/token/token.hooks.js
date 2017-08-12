const errors = require('feathers-errors');
const { when, disallow } = require('feathers-hooks-common');

const validateIntent = () => hook => {
  const intent = hook.service.intents[hook.id];
  if(intent !== undefined) {
    hook.service.remove(hook.id, { validated: true });
  } else {
    throw new errors.NotFound('Authentication intent not found.');
  }
}

module.exports = {
  before: {
    create: [
      disallow('rest', 'socketio'),
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
      when(hook => hook.data.authenticated, [
        validateIntent(),
        hook => {
          const telegram = hook.app.telegram;
          if(hook.data.authenticated) {
            telegram.sendMessage(hook.id, 'You are authenticated! You can go back to your browser now.');
          }
        }
      ])
    ],
    remove: [
      disallow('rest', 'socketio'),
      hook => {
        const telegram = hook.app.telegram;
        if(!hook.params.validated) {
          telegram.sendMessage(hook.id, 'No browser response, authentication timed out. Refresh your browser page and try again.');
        }
      }
    ]
  },
  after: {
    create: [
      hook => {
        const user = hook.data.user;
        const telegram = hook.app.telegram;
        telegram.sendMessage(user.id, 'Waiting for browser response...', {
          disable_notification: true
        });
        telegram.sendChatAction(user.id, 'typing');
      }
    ]
  },
  error: {
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
