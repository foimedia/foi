module.exports = function (app) {

  const service = app.service('media');

  function createPostMedia (post) {
    let promises = [];
    if(typeof post.content !== 'string' && post.content.file_id) {
      if(Array.isArray(post.content)) {
        post.content.forEach(file => {
          promises.push(service.create(file));
          if(file.thumb) {
            promises.push(service.create(file.thumb));
          }
        });
      } else {
        promises.push(service.create(post.content));
        if(post.content.thumb) {
          promises.push(service.create(post.content.thumb));
        }
      }
    }
    return Promise.all(promises);
  };

  return {
    createPostMedia
  };

};
