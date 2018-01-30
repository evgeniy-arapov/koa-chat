if (process.env.TRACE) {
  require("./libs/trace");
}

const Koa = require("koa");
const app = new Koa();

const config = require("config");

// keys for in-koa KeyGrip cookie signing (used in session, maybe other modules)
app.keys = [config.secret];

const path = require("path");
const fs = require("fs");

const handlers = fs.readdirSync(path.join(__dirname, "handlers")).sort();

handlers.forEach(handler => require("./handlers/" + handler).init(app));

// ---------------------------------------

const Router = require("koa-router");

const router = new Router();

let clients = [];

router.get("/subscribe", async (ctx, next) => {

  ctx.set("Cache-Control", "no-cache,must-revalidate");
  const promise = new Promise((resolve, reject) => {
    clients.push(resolve);

    ctx.res.on("close", function () {
      clients.splice(clients.indexOf(resolve), 1);
      const error = new Error("Connection closed");
      error.code = "ECONNRESET";
      reject(error);
    });

  });

  let message;

  try {
    message = await promise;
  } catch (err) {
    if (err.code === "ECONNRESET") return;
    throw err;
  }

  // console.log('DONE', message);
  ctx.body = message;

});

router.post("/publish", async (ctx, next) => {
  const message = ctx.request.body.message;

  if (!message) {
    ctx.throw(400);
  }

  clients.forEach(function (resolve) {
    resolve(String(message));
  });

  clients = [];

  ctx.body = "ok";

});

app.use(router.routes());

app.listen(config.get("port"), () => {
  console.log(`Server started on port ${config.get("port")}`);
});
