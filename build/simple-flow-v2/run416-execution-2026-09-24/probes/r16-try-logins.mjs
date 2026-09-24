// Try the recorded lower-permission accounts against the API directly. No browser, no session eviction
// risk for the account I am currently using.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const port = fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const browser = await chromium.launch({ args:['--no-sandbox'], executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium', proxy: { server: `http://127.0.0.1:${port}` } });
const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
const pass = 'analyst1';
for (const user of ['bilal.muzamil+serviceadvisornoreports@shopview.com','bilal.muzamil+serviceadvisorlimitedview@shopview.com','bilal.muzamil+mainadmin@shopview.com']) {
  const r = await ctx.request.post('https://api.shopview.com/api/login', { data: { username: user, password: pass }, headers: { 'Content-Type':'application/json', Accept:'application/json' }, ignoreHTTPSErrors: true });
  const body = (await r.text()).slice(0, 160);
  console.log(user.padEnd(56), '->', r.status(), body.replace(/"token":"[^"]+"/, '"token":"<hidden>"').slice(0,110));
}
await browser.close();
