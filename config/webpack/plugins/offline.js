const OfflinePlugin = require('offline-plugin');

module.exports = new OfflinePlugin({
  ServiceWorker: {
    events: true
  }
});
