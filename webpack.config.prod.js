var path = require('path');
var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');

var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: path.join(__dirname, 'client', 'index.html'),
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  devtool: 'source-map',
  entry: [
    './client/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    HTMLWebpackPluginConfig
  ],
  module: {
    loaders: [{
      test: /\.jsx?/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react']
      },
      exclude: /node_modules/
    }]
  }
};
