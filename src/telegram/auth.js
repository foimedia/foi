module.exports = function (app) {

  const service = app.service('authorize');

  app.bot.onText(/\/start (.+)/, (msg, match) => {
    const token = match[1];
    service.create({
      userId: msg.from.id,
      userKey: token
    });
  });

};
