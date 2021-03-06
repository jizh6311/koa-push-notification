// TODO: Get vapid key on client-side instead of hard-code
async function getPublicKey() {
  try {
    let keysRawData = await fetch('keys.json');
    return keysRawData.json();
  } catch (err) {
    console.log(err);
  }
}

if ('serviceWorker' in navigator) {
  console.log('Registering service worker');

  run().catch(error => console.error(error));
}

async function run() {
  console.log('Registering service worker');
  const registration = await navigator.serviceWorker.
    register('./scripts/worker.js', {scope: '/scripts/'});
  console.log('Registered service worker');

  console.log('Registering push');
  const publicVapidKeyRes = await getPublicKey();
  console.log(JSON.stringify(publicVapidKeyRes))
  const subscription = await registration.pushManager.
    subscribe({
      userVisibleOnly: true,
      // The `urlBase64ToUint8Array()` function is the same as in
      // https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
      applicationServerKey: urlBase64ToUint8Array(publicVapidKeyRes["PUBLIC_VAPID_KEY"])
    });

  console.log('Registered push');

  while (true) {
    console.log('Sending push');
    await fetch('/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'content-type': 'application/json'
      }
    });
    
    // Send notification every 1 min
    await new Promise(r => setTimeout(r, 1000 * 60));
    console.log('Sent push');
  }
}

// Boilerplate borrowed from https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
