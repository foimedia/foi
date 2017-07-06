const mkdirp = require('mkdirp');
const errors = require('feathers-errors');

const fetch = () => hook => {
  const bot = hook.app.bot;
  if(!hook.data.file_id) {
    throw new errors.BadRequest('Missing file id.');
  } else {
    const fileId = hook.data.file_id;
    const path = hook.app.get('filesDir') + '/' + fileId;
    return new Promise((resolve, reject) => {
      mkdirp(path, () => {
        resolve(
          bot.downloadFile(fileId, path).then(res => {
            hook.data.file_name = res.split('/').slice(-1)[0];
            return hook;
          }).catch(err => {
            throw new errors.GeneralError(err);
          })
        );
      });
    })
  }
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      (hook) => {
        if(hook.params.provider)
          throw new errors.Forbidden('Media files can only be created internally');
        return hook;
      },
      fetch()
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
