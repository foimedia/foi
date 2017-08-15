const path = require('path');
const WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = new WebpackPwaManifest({
  name: 'FOI Publishing Bot',
  short_name: 'FOI',
  description: 'Real-time coverage of events for journalists and activists.',
  background_color: '#222',
  orientation: 'portrait',
  start_url: '/?launcher=true',
  icons: [
    {
      src: path.resolve('client/images/icons', 'launcher.png'),
      sizes: [48, 96, 192, 256, 512]
    }
  ]
});
