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

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');

const mongodb = require('./mongodb');

const telegram = require('./telegram');

const authentication = require('./authentication');

const app = feathers();

const env = app.get('env');
const webpackConfig = require(`../config/webpack/${env}`);

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
// Configure authentication (see `authentication.js`)
app.configure(authentication);
// Set up Telegram Bot (see `telegram.js`)
app.configure(telegram);
// Set up our services (see `services/index.js`)
app.configure(services);

// Configure a middleware for the error handler
app.use(handler());

if(env !== 'production') {
  const history = require('connect-history-api-fallback');
  const webpack = require('webpack');
  const compiler = webpack(webpackConfig);
  const webpackDev = require('webpack-dev-middleware');
  const hmr = require("webpack-hot-middleware");
  app.use(history()); // pushState
  app.use(webpackDev(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(hmr(compiler, {
    log: console.log,
    path: "/__webpack_hmr",
    heartbeat: 2000
  }));
} else {
  app.use(feathers.static(webpackConfig.output.path));
  // Allow pushState
  app.get('/*', function(req, res) {
    res.sendFile(path.join(webpackConfig.output.path, 'index.html'));
  });
}

app.hooks(appHooks);

module.exports = app;
