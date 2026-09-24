// Survey what Trucks Hill 2 actually holds, so the run seeds only what is missing (Rule 14/107).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 14000 });
const g = async (p) => { const r = await ctx.request.get(`https://${APIH}${p}`, { headers:{Accept:'application/json'}, ignoreHTTPSErrors:true }); return { s:r.status(), b: r.status()===200 ? await r.json() : (await r.text()).slice(0,200) }; };
for (const p of ['/api/work-orders?limit=25','/api/purchase-orders?limit=10','/api/vendors?limit=5','/api/inventory/parts?limit=5']) {
  const r = await g(p);
  console.log('---', p, '->', r.s);
  if (r.s===200) { const d=r.b?.data; const arr=Array.isArray(d)?d:(d?.items||d?.data||[]);
    console.log('  count', Array.isArray(arr)?arr.length:'?', 'meta', JSON.stringify(r.b?.meta||{}).slice(0,200));
    if(Array.isArray(arr)) for(const x of arr.slice(0,25)) console.log('   ', JSON.stringify({id:x.id,num:x.number??x.workOrderNumber??x.poNumber,status:x.status,name:x.name,title:x.title}).slice(0,180));
  } else console.log('  ', r.b);
}
const t=await page.evaluate(()=>document.body.innerText); fs.writeFileSync(`${EV}/workorders-list.txt`,t);
console.log('=== WO LIST PAGE ==='); console.log(t.slice(t.indexOf('Invoices')>0?t.indexOf('Invoices'):0,2200));
await browser.close();
