
// Usually served by Nginx
const favicon = require('koa-favicon');

//exports.init = app => app.use(favicon());
exports.init = app => app.use(async (ctx, next) => { await next(); });
