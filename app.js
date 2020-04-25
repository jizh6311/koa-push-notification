require('dotenv').config()

const Koa = require('koa');
const Router = require('koa-router');
const logger = require("koa-logger");
const serve = require('koa-static');

const webpush = require("web-push");
const path = require("path");
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const app = new Koa();
const router = new Router();

app.use(serve(path.join(__dirname, "./frontend/build")));

app.use(bodyParser());
app.use(logger());
app.use(cors());

// Replace with your email
webpush.setVapidDetails(
  process.env.MAILTO,
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

router.post('/subscribe', (ctx, next) => {
  // Get pushSubscription object
  const subscription = ctx.request.body;

  // Send 201 - resource created
  ctx.status = 201;
  
  // Create payload
  const payload = JSON.stringify({ title: "Push Test" });

  // Pass object into sendNotification
  webpush
  .sendNotification(subscription, payload)
  .catch(err => console.error(err));
});

app
  .use(router.routes())
  .use(router.allowedMethods());
  
app.listen(5000, () => {
  console.log("listening on port 5000")
});
