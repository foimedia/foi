module.exports = function () {

  const app = this;

  const service = app.service('media');

  function createMessageMedia (message) {
    const type = message.getType();
    const media = message[type];
    let promises = [];
    if(typeof media !== 'string' && (media.file_id || media[0].file_id)) {
      if(Array.isArray(media)) {
        media.forEach(file => {
          promises.push(service.create(file));
          if(file.thumb) {
            promises.push(service.create(file.thumb));
          }
        });
      } else {
        promises.push(service.create(media));
        if(media.thumb) {
          promises.push(service.create(media.thumb));
        }
      }
    }
    return Promise.all(promises);
  };

  return Object.assign(app.telegram || {}, {
    media: {
      createMessageMedia
    }
  });

};
