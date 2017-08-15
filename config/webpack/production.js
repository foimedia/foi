const config = require('./common');
const path = require('path');
const webpack = require('webpack');
const OfflinePlugin = require('offline-plugin');

config.devtool = 'source-map';

config.output.filename = '[name]-[chunkhash].js';
config.output.chunkFilename = '[name]-[chunkhash].js';

config.plugins.unshift(require('./html'), require('./manifest'));

config.plugins = config.plugins.concat([
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    },
    sourceMap: false
  }),
  new OfflinePlugin()
]);

module.exports = config;
