const config = require('./common');
const path = require('path');
const webpack = require('webpack');

config.entry = {
  widget: './client/widget'
};

config.output.filename = '[name].js';
config.output.chunkFilename = '[name]-[chunkhash].js';

config.devtool = 'source-map';

config.plugins = config.plugins.concat([
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    },
    sourceMap: false
  })
]);

module.exports = config;
