const config = require('./common');
const webpack = require('webpack');

config.entry.unshift('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&overlay=false&reload=true');

config.devtool = 'cheap-eval-source-map';

config.output.filename = '[name].js';

config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
]);

module.exports = config;
