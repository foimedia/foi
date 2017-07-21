const config = require('./common');
const webpack = require('webpack');

config.entry.main.unshift('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&overlay=false&reload=true');

config.entry.widget = './client/widget';

config.devtool = 'cheap-eval-source-map';

config.output.filename = '[name].js';
config.output.chunkFilename = '[name].js';

config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
]);

module.exports = config;
