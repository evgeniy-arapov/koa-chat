// no templates in this example

exports.init = app => app.use(async (ctx, next) => {
  await next();
});
