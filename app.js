'use strict';

const fs = require('fs');
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
let rawDataForKeys = fs.readFileSync('./keys.json');
let dataForKeys = JSON.parse(rawDataForKeys)
webpush.setVapidDetails(
  dataForKeys["MAILTO"],
  dataForKeys["PUBLIC_VAPID_KEY"],
  dataForKeys["PRIVATE_VAPID_KEY"]
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
