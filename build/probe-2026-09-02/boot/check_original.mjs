// Did the quick-login rotation break the QA lead's ORIGINAL session? Fresh context, original
// cookies only, one read-only call. 409 at fe-permissions is the recorded "cookies expired" signal
// (staging-boot2.mjs). Nothing is written back to the cookie file either way.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const APP='https://sv9315.qa.shopview.com', API='https://sv9315api.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const browser=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await browser.newContext({ignoreHTTPSErrors:true});
await ctx.addCookies(cookies.map(c=>({name:c.name,value:c.value,domain:'.qa.shopview.com',path:'/'})));
const page=await ctx.newPage(); page.setDefaultTimeout(45000);
await page.goto(APP+'/login',{waitUntil:'domcontentloaded'});
for (const path of ['/api/auth/me/fe-permissions','/api/work-orders/statuses']) {
  const r = await page.evaluate(async u => {
    const x = await fetch(u,{credentials:'include',headers:{Accept:'application/json'}});
    return {status:x.status, head:(await x.text()).slice(0,120)};
  }, API+path);
  console.log(`${path.padEnd(32)} ${r.status}  ${r.status>=400?r.head.replace(/\s+/g,' '):'OK'}`);
}
await browser.close();
