const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const errors = require('feathers-errors');
const { when, iff, discard, disallow } = require('feathers-hooks-common');

const fetchFiles = () => hook => {
  const bot = hook.app.telegram.bot;
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

const removeFiles = () => hook => {
  const filesDir = hook.app.get('filesDir');
  return new Promise((resolve, reject) => {
    rimraf(path.resolve(filesDir, hook.id), resolve);
  });
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ disallow('external'), fetchFiles() ],
    update: [ disallow('external') ],
    patch: [ disallow('external') ],
    remove: [ disallow('external'), removeFiles() ]
  },

  after: {
    all: [
      when(
        hook => hook.params.provider,
        discard('_id')
      )
    ],
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
