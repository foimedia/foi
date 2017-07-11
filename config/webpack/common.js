const path = require('path');
const webpack = require('webpack');
const config = require('config');
const env = process.env.NODE_ENV || 'development';
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    './client/index'
  ],
  output: {
    path: path.resolve('public'),
    publicPath: '/',
    filename: 'assets/[name]-[chunkhash].js',
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve('client', 'index.html'),
      filename: 'index.html',
      inject: 'body'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(env)
      },
      'foi': {
        'botName': JSON.stringify(config.get('telegram').botName)
      }
    })
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
