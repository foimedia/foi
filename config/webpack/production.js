const config = require('./common');
const path = require('path');
const webpack = require('webpack');

config.devtool = 'source-map';

config.plugins = config.plugins.concat([
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    },
    sourceMap: false
  })
]);

module.exports = config;
