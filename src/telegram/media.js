module.exports = function () {

  const app = this;

  const service = app.service('media');

  function createMessageMedia (message) {
    const type = message.getType();
    const media = message[type];
    let promises = [];
    if(typeof media !== 'string') {
      if(Array.isArray(media) && media[0].file_id) {
        media.forEach(file => {
          promises.push(service.create(file));
          if(file.thumb) {
            promises.push(service.create(file.thumb));
          }
        });
      } else if(media.file_id) {
        promises.push(service.create(media));
        if(media.thumb) {
          promises.push(service.create(media.thumb));
        }
      } else {
        return Promise.all(promises);
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
