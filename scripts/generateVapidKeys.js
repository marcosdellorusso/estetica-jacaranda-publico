// scripts/generateVapidKeys.js

const webPush = require('web-push');
const fs = require('fs');
const path = require('path');

const vapidKeys = webPush.generateVAPIDKeys();

const envData = `
VAPID_PUBLIC_KEY=${vapidKeys.publicKey}
VAPID_PRIVATE_KEY=${vapidKeys.privateKey}
`;

fs.writeFileSync(path.join(__dirname, '../.env.local'), envData, { flag: 'w' });

console.log('VAPID keys generadas y guardadas en .env.local');
console.log('Clave pública:', vapidKeys.publicKey);
console.log('Clave privada:', vapidKeys.privateKey);
