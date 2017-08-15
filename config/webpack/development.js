const config = require('./common');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OfflinePlugin = require('offline-plugin');

config.entry.main.unshift('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&overlay=false&reload=true');

config.entry.widget = './client/widget';

config.devtool = 'cheap-eval-source-map';

config.output.filename = '[name].js';
config.output.chunkFilename = '[name].js';

config.plugins.unshift(require('./html'), require('./manifest'));

config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    analyzerHost: '0.0.0.0'
  }),
  new OfflinePlugin()
]);

module.exports = config;
