const config = require('./common');
const path = require('path');
const webpack = require('webpack');
const OfflinePlugin = require('offline-plugin');

config.devtool = 'source-map';

config.output.filename = '[name]-[chunkhash].js';
config.output.chunkFilename = '[name]-[chunkhash].js';

config.plugins.unshift(
  require('./plugins/html'),
  require('./plugins/favicons'),
  require('./plugins/manifest')
);

config.plugins = config.plugins.concat([
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    },
    sourceMap: false
  }),
  require('./plugins/offline')
]);

module.exports = config;
