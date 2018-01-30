
// Usually served by Nginx
const serve = require('koa-static');

//exports.init = app => app.use(serve('public'));
exports.init = app => app.use(async (ctx, next) => { await next(); });
