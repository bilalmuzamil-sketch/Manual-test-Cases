import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ID=process.argv[2], TAG=process.argv[3]||'lines';
const { browser, ctx, APIH } = await bootProdLogin('/workorders', { settle: 8000 });
const r = await ctx.request.get(`https://${APIH}/api/work-orders/lines/${ID}`, {headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
const j = await r.json();
fs.writeFileSync(`${EV}/${TAG}-lines-api.json`, JSON.stringify(j,null,1));
const lines = j.data?.collection || j.data?.lines || j.data || [];
console.log('status', r.status(), '| lines', Array.isArray(lines)?lines.length:Object.keys(lines));
const L = Array.isArray(lines)?lines:[];
for (const l of L) {
  console.log('LINE', l.id, '|', l.status?.label||l.status, '|', (l.name||l.description||'').slice(0,40));
  for (const p of (l.parts||l.partRequests||[])) console.log('   PART', (p.name||p.partName||'').slice(0,28), '| status', JSON.stringify(p.status), '| vendor', p.vendor?.name||p.vendorName||null, '| keys', Object.keys(p).slice(0,22).join(','));
}
await browser.close();
