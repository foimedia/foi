const config = require('./common');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

config.entry.main.unshift('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&overlay=false&reload=true');

config.entry.widget = './client/widget';

config.devtool = 'cheap-eval-source-map';

config.output.filename = '[name].js';
config.output.chunkFilename = '[name].js';

config.plugins.unshift(require('./html'));

config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    analyzerHost: '0.0.0.0'
  })
]);

module.exports = config;
