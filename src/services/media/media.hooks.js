const fs = require("fs");
const moment = require("moment");
const path = require("path");
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
const errors = require("feathers-errors");
const { when, iff, discard, disallow } = require("feathers-hooks-common");

const fetchFiles = (file, dir, telegram) => {
  const path = dir + "/" + file.file_id;
  return new Promise((resolve, reject) => {
    mkdirp(path, () => {
      telegram
        .downloadFile(file.file_id, path)
        .then(res => {
          file.file_name = res.split("/").slice(-1)[0];
          resolve(file);
        })
        .catch(err => {
          throw new errors.GeneralError(err);
        });
    });
  });
};

const checkFiles = () => hook => {
  const mediaService = hook.app.service("media");
  const dir = hook.app.get("filesDir");
  const telegram = hook.app.telegram;
  const now = moment();
  const check = file => {
    const lastCheck = hook.result.last_check;
    if (!file.last_check || moment(file.last_check).isBefore(now, "hour")) {
      mediaService.patch(file.file_id, { last_check: new Date() });
      let path = dir + "/" + file.file_id;
      if (file.file_name) {
        path += "/" + file.file_name;
      }
      return new Promise((resolve, reject) => {
        fs.access(path, fs.constants.F_OK, err => {
          if (err) {
            fetchFiles(file, dir, telegram).then(file => resolve(file));
          } else {
            resolve(file);
          }
        });
      });
    } else {
      return Promise.resolve();
    }
  };
  if (hook.type == "after") {
    if (Array.isArray(hook.result)) {
      let promises = [];
      for (let file of hook.result) {
        if (file && file.file_id) {
          promises.push(check(file));
        }
      }
      return Promise.all(promises).then(() => hook);
    } else if (hook.result.file_id) {
      return check(hook.result).then(() => hook);
    }
  }
  return hook;
};

const createFiles = () => hook => {
  const dir = hook.app.get("filesDir");
  const telegram = hook.app.telegram;
  if (!hook.data.file_id) {
    throw new errors.BadRequest("Missing file id.");
  } else {
    return fetchFiles(hook.data, dir, telegram).then(file => {
      hook.data = file;
      return hook;
    });
  }
};

const removeFiles = () => hook => {
  const filesDir = hook.app.get("filesDir");
  return new Promise((resolve, reject) => {
    rimraf(path.resolve(filesDir, hook.id), resolve);
  });
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [disallow("external"), createFiles()],
    update: [disallow("external")],
    patch: [disallow("external")],
    remove: [disallow("external"), removeFiles()]
  },

  after: {
    all: [when(hook => hook.params.provider, discard("_id"))],
    find: [checkFiles()],
    get: [checkFiles()],
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
