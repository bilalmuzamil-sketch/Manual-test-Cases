// The app's own first call is GET https://sv9315api.qa.shopview.com/api/api/sso/check -> 404.
// The DOUBLED /api/api/ is the suspicious part: /api/auth/me/fe-permissions (single) answers 200.
// So: is the front end asking for a path that does not exist on this build?
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const APP='https://sv9315.qa.shopview.com', API='https://sv9315api.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const b=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await b.newContext({ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
const p=await ctx.newPage(); p.setDefaultTimeout(60000);
await p.goto(`${APP}/login`,{waitUntil:'domcontentloaded'});
const get = path => p.evaluate(async u => {
  const r=await fetch(u,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t);}catch(_){}
  return {status:r.status, keys:j&&typeof j==='object'?Object.keys(j):null, head:t.slice(0,180)};
}, path);
for (const path of ['/api/api/sso/check','/api/sso/check','/sso/check','/api/auth/sso/check',
                    '/api/auth/me/fe-permissions','/api/auth/me/permissions','/api/auth/user','/api/me']) {
  const r = await get(API+path);
  console.log(`${path.padEnd(32)} ${r.status}  keys=${JSON.stringify(r.keys)}`);
  if (r.status>=400) console.log('     ', r.head.replace(/\s+/g,' ').slice(0,120));
}
await b.close();
