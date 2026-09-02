// READ-ONLY. C45097/C45098 asked whether a work order with NO CUSTOMER or NO ASSET exists.
// The earlier answer came from the CREATE FORM refusing to save, which is not evidence about
// existing records. This asks the list that actually holds them.
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
  return {status:r.status,json:j,head:t.slice(0,300)};
}, API+path);

const first = await get('/api/work-orders');
const d = first.json?.data;
console.log('data keys:', d?Object.keys(d):null);
const arr = d?.work_orders;
console.log('collection length on page 1:', Array.isArray(arr)?arr.length:'(not an array)');
if (Array.isArray(arr) && arr.length) console.log('a record\'s fields:', Object.keys(arr[0]).join(', '));
console.log('pagination:', JSON.stringify(d?.pagination));

// page the whole list and count the two states, reading each record's own fields
let page=1, total=0, noCust=[], noAsset=[], seen=new Set();
while (page<=40) {
  const r = await get(`/api/work-orders?page=${page}&limit=100`);
  const c = r.json?.data?.work_orders;
  if (!Array.isArray(c) || !c.length) break;
  for (const w of c) {
    if (seen.has(w.id)) continue; seen.add(w.id); total++;
    const cust = w.customer ?? w.customer_name ?? w.customerName ?? null;
    const asset = w.asset ?? w.vehicle ?? w.asset_name ?? null;
    if (cust===null || cust==='' || (typeof cust==='object' && cust && !Object.keys(cust).length)) noCust.push(w.number||w.id);
    if (asset===null || asset==='' || (typeof asset==='object' && asset && !Object.keys(asset).length)) noAsset.push(w.number||w.id);
  }
  if (c.length<100) break;
  page++;
}
console.log(`\nwork orders paged: ${total}`);
console.log(`with NO customer: ${noCust.length}`, noCust.slice(0,10));
console.log(`with NO asset   : ${noAsset.length}`, noAsset.slice(0,10));
await b.close();
