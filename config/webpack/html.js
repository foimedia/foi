const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = new HTMLWebpackPlugin({
  template: path.resolve('client', 'index.html'),
  filename: 'index.html',
  inject: 'body',
  chunks: ['main']
});
