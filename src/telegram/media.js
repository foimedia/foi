module.exports = function () {

  const app = this;

  const service = app.service('media');

  function createMedia (file) {
    return service.find({
      query: {
        file_id: file.file_id
      }
    }).then(res => {
      if(res.data.length) {
        return Promise.resolve();
      } else {
        return service.create(file);
      }
    });
  };

  function createMessageMedia (message) {
    const type = message.getType();
    if(type !== undefined) {
      const media = message[type];
      if(typeof media !== 'string') {
        let promises = [];
        if(Array.isArray(media) && media[0].file_id) {
          media.forEach(file => {
            service
            promises.push(createMedia(file));
            if(file.thumb) {
              promises.push(createMedia(file.thumb));
            }
          });
        } else if(media.file_id) {
          promises.push(createMedia(media));
          if(media.thumb) {
            promises.push(createMedia(media.thumb));
          }
        } else {
          return Promise.all(promises).then(() => {
            return message;
          });
        }
      }
    }
    return Promise.resolve(message);
  };

  return Object.assign(app.telegram || {}, {
    media: {
      createMedia,
      createMessageMedia
    }
  });

};
