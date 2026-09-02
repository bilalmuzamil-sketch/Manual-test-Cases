// READ-ONLY. Does the QA lead's cookie set authenticate against the real API host?
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const APP='https://sv9315.qa.shopview.com', API='https://sv9315api.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const b=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1600,height:1100}});
await ctx.addCookies(cookies);
const p=await ctx.newPage(); p.setDefaultTimeout(60000);
await p.goto(`${APP}/login`,{waitUntil:'domcontentloaded'});
const get = path => p.evaluate(async u => {
  const r = await fetch(u,{credentials:'include',headers:{Accept:'application/json'}});
  const t = await r.text(); let j=null; try{j=JSON.parse(t);}catch(_){}
  return {status:r.status, isHtml:/^\s*<!doctype/i.test(t), keys:j&&typeof j==='object'?Object.keys(j):null,
          n: j&&j.data&&Array.isArray(j.data)?j.data.length:(Array.isArray(j)?j.length:null), head:t.slice(0,160)};
}, path);
for (const path of ['/api/auth/me','/api/work-orders/statuses','/api/work-orders/line-statuses','/api/roles']) {
  const r = await get(API+path);
  console.log(`${path.padEnd(34)} ${r.status} html=${String(r.isHtml).padEnd(5)} keys=${JSON.stringify(r.keys)} n=${r.n}`);
  if (r.status>=400 && !r.isHtml) console.log('    ', r.head.slice(0,140));
}
await b.close();
