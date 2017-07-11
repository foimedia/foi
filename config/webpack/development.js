const config = require('./common');
const webpack = require('webpack');

config.devtool = 'cheap-module-eval-source-map';

config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
]);

module.exports = config;
