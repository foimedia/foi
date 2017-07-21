const path = require('path');
const webpack = require('webpack');
const config = require('config');
const env = process.env.NODE_ENV || 'development';

module.exports = {
  entry: {
    main: ['./client/index']
  },
  resolve: {
    modules: [
      path.resolve('client'),
      'node_modules'
    ],
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat'
    }
  },
  output: {
    path: path.resolve('public'),
    publicPath: config.get('url') + '/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(env)
      },
      'foi': {
        'url': JSON.stringify(config.get('url')),
        'botName': JSON.stringify(config.get('telegram').username)
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|jpg|gif|svg|woff2|woff|eot|ttf)$/,
        loader: 'file-loader'
      }
    ]
  }
};
