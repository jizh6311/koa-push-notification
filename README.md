# koa-push-notification
A client-side script to push notifications for grocery shoppings

## Project Setup
1. Run `yarn install`
2. Run `./node_modules/.bin/web-push generate-vapid-keys` to generate vapid keys
3. Add a local .env file
```
PUBLIC_VAPID_KEY=<Generated Pulic Key>
PRIVATE_VAPID_KEY=<Generated Private Key>
MAILTO=mailto:<Your Email>
```
4. Run `yarn build` to build front-end react.js project
5. Run `yarn start`. A notification should pop out once you visit `localhost:5000` in your browser.
