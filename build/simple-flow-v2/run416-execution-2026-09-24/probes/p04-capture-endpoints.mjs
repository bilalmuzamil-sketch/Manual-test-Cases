// Learn the app's OWN endpoints by watching what it calls (never guess a route - Rule 97/104).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const { browser, page, ctx, APIH } = await bootProdLogin('/dashboard', { settle: 8000 });
const seen = [];
page.on('request', r => { const u = r.url(); if (u.includes('/api/')) seen.push(r.method() + ' ' + u.replace('https://api.shopview.com','')); });
for (const route of ['/workorders','/parts','/administration/settings']) {
  await page.goto('https://app.shopview.com'+route, { waitUntil:'domcontentloaded' });
  await page.waitForTimeout(9000);
  console.log('=== after', route); 
}
fs.writeFileSync(`${EV}/endpoints-seen.txt`, [...new Set(seen)].join('\n'));
console.log([...new Set(seen)].join('\n'));
await browser.close();
