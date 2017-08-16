const path = require('path');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = new FaviconsWebpackPlugin({
  logo: path.resolve('client/images', 'logo.png')
});
