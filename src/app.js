const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');

const handler = require('feathers-errors/handler');
const notFound = require('feathers-errors/not-found');


const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');

const mongodb = require('./mongodb');

const telegram = require('./telegram');

const authentication = require('./authentication');

const app = feathers();

const env = app.get('env');
const webpackConfig = require(`../config/webpack/${env}`);

if(env !== 'production') {
  const webpack = require('webpack');
  const compiler = webpack(webpackConfig);
  const webpackDev = require('webpack-dev-middleware');
  const hmr = require("webpack-hot-middleware");
  app.use(webpackDev(compiler, {
    // noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(hmr(compiler));
} else {
  app.use('/', feathers.static(webpackConfig.output.path));
}

// Load app configuration
app.configure(configuration(path.join(__dirname, '..')));
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/files', feathers.static(app.get('filesDir')));

// Set up Plugins and providers
app.configure(hooks());
app.configure(mongodb);
app.configure(rest());
app.configure(socketio());

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up Telegram Bot
app.configure(telegram);
// Configure a middleware for 404s and the error handler
app.use(notFound());
app.use(handler());

app.hooks(appHooks);

module.exports = app;
