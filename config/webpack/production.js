const config = require('./common');
const path = require('path');
const webpack = require('webpack');

config.devtool = 'source-map';

config.output.filename = '[name]-[chunkhash].js';
config.output.chunkFilename = '[name]-[chunkhash].js';

config.plugins.unshift(require('./html'));

config.plugins = config.plugins.concat([
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    },
    sourceMap: false
  })
]);

module.exports = config;
