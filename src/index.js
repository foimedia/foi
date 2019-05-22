/* eslint-disable no-console */
const logger = require("winston");
const https = require("https");
const fs = require("fs");
const app = require("./app");
const port = process.env.PORT || 3030;
const ssl = app.get("ssl");

let server;
if (typeof ssl == "object") {
  server = https
    .createServer(
      {
        key: fs.readFileSync(ssl.key),
        cert: fs.readFileSync(ssl.cert)
      },
      app
    )
    .listen(port);
  app.setup(server);
} else {
  server = app.listen(port);
}

process.on("unhandledRejection", (reason, p) =>
  logger.error("Unhandled Rejection at: Promise ", p, reason)
);

server.on("listening", () =>
  logger.info(`Application started on port ${port}`)
);
