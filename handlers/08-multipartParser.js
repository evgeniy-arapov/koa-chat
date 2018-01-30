// recieve multipart/form
// without files

// for routes which require custom file handling
// can introduce config to ignore them here

const busboy = require('co-busboy');

exports.init = app => app.use(async (ctx, next) => {
  // the body isn't multipart, so busboy can't parse it
  if (!ctx.request.is('multipart/*')) {
    await next();
    return;
  }

  const parser = busboy(ctx, {
    autoFields: true
  });

  let fileStream;

  while (fileStream = await parser) {
    // autoFields => part is a file
    // specific handlers know how to handle the file, not us
    // alt: can auto-save to disk
    ctx.throw(400, "Files are not allowed here");
  }

  // copy normal fields from parser to ctx.request.body
  const body = ctx.request.body;

  for (let [name, val, fieldnameTruncated, valTruncated] of parser.fields) {
    if (body[name]) { // same value already exists
      if (!Array.isArray(body[name])) { //  convert to array
        body[name] = [body[name]];
      }
      body[name].push(val);
    } else {
      body[name] = val;
    }
  }

  await next();
});
