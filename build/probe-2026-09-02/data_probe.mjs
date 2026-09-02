// READ-ONLY. Answers the three E questions from the source that actually answers each.
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg; import fs from 'fs';
const APP='https://sv9315.qa.shopview.com', API='https://sv9315api.qa.shopview.com';
const port=fs.readFileSync('/tmp/atlassian/bridge-port.txt','utf8').trim();
const cookies=JSON.parse(fs.readFileSync('/tmp/qa-cookies/sv9315-cookies.json','utf8'));
const b=await chromium.launch({args:['--no-sandbox'],proxy:{server:`http://127.0.0.1:${port}`}});
const ctx=await b.newContext({ignoreHTTPSErrors:true});
await ctx.addCookies(cookies);
const p=await ctx.newPage(); p.setDefaultTimeout(60000);
await p.goto(`${APP}/login`,{waitUntil:'domcontentloaded'});
const get = path => p.evaluate(async u => {
  const r=await fetch(u,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t);}catch(_){}
  return {status:r.status,json:j,head:t.slice(0,300)};
}, API+path);

console.log('=== line statuses, verbatim');
const ls = await get('/api/work-orders/line-statuses');
console.log(JSON.stringify(ls.json).slice(0,600));
console.log('\n=== work order statuses, verbatim');
const ws = await get('/api/work-orders/statuses');
console.log(JSON.stringify(ws.json).slice(0,600));

console.log('\n=== hunting the work-order LIST route');
for (const r of ['/api/work-orders','/api/work-orders/list','/api/work-orders/search',
                 '/api/work-orders/index','/api/work-orders/paginated']) {
  const x = await get(r);
  const n = x.json && x.json.data ? (Array.isArray(x.json.data)?x.json.data.length:
             (x.json.data.collection?x.json.data.collection.length:'obj')) : null;
  console.log(`  ${r.padEnd(32)} ${x.status} ${n===null?x.head.slice(0,90).replace(/\s+/g,' '):'items='+n}`);
}
await b.close();
