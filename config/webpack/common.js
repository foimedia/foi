const path = require('path');
const webpack = require('webpack');
const config = require('config');
const env = process.env.NODE_ENV || 'development';

const GitRevisionPlugin = require('git-revision-webpack-plugin');

const gitRevisionPlugin = new GitRevisionPlugin();

module.exports = {
  entry: {
    main: ['./client/index']
  },
  resolve: {
    modules: [
      'client',
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
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|pt-br/),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(env)
      },
      'foi': {
        'url': JSON.stringify(config.get('url')),
        'botName': JSON.stringify(config.get('telegram').username),
        'defaultUserRoles': JSON.stringify(config.get('defaultUserRoles')),
        'VERSION': JSON.stringify(gitRevisionPlugin.version())
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
          plugins: [
            'transform-object-rest-spread',
            'syntax-class-properties',
            'transform-class-properties'
          ]
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
