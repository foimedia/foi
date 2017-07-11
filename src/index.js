/* eslint-disable no-console */
const logger = require('winston');
const app = require('./app');
const port = process.env.PORT || 3030;
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info(`Application started on port ${port}`)
);
