module.exports = function (app, path) {
  const telegram = app.telegram;
  const service = app.service(path);
  telegram.onText(/\/start ([a-zA-Z0-9]{12})/, (data, match) => {
    service.create({
      userId: data.from.id,
      userKey: match[1],
    }, {
      telegram: true,
      message: data
    });
  });
};
