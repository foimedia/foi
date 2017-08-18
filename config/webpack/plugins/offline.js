const OfflinePlugin = require('offline-plugin');

module.exports = new OfflinePlugin({
  ServiceWorker: {
    events: true
  },
  cacheMaps: [
    {
      match: (url) => {
        const offlinePaths = /(?:^\/c\/|^\/s\/|^\/admin)/;
        if(url.origin !== location.origin) return;
        if(url.pathname.match(offlinePaths) !== null) {
          return new URL('/', location);
        } else {
          return;
        }
      },
      requestTypes: ['navigate', 'same-origin']
    }
  ]
});
