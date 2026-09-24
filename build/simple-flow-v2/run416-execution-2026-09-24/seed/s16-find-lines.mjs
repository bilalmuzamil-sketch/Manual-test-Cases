// Find work orders that already carry lines awaiting approval, rather than making new ones.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/seed';
const { browser, ctx, APIH } = await bootProdLogin('/workorders', { settle: 9000 });
const list = JSON.parse(fs.readFileSync('/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence/wo-list.json','utf8'));
const hits = [];
for (const w of list.slice(0, 70)) {
  try { const r = await ctx.request.get(`https://${APIH}/api/work-orders/lines/${w.id}`, {headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
    if (r.status() !== 200) continue;
    const j = await r.json(); const coll = j.data?.collection || [];
    const st = coll.map(l=>l.status);
    const needs = st.filter(s=>s==='authorization_required').length;
    if (needs >= 1) hits.push({ wo: w.number, id: w.id, status: w.status, lines: st, needs, parts: coll.reduce((a,l)=>a+(l.parts||[]).length,0) });
  } catch(e){}
}
hits.sort((a,b)=> (b.needs-a.needs) || (b.lines.length-a.lines.length));
console.log('work orders with lines awaiting approval:', hits.length);
for (const h of hits.slice(0,12)) console.log(' ', h.wo, '|', h.status, '| lines', JSON.stringify(h.lines), '| parts', h.parts, '|', h.id);
fs.writeFileSync(`${EV}/wos-with-needs-approval.json`, JSON.stringify(hits,null,1));
await browser.close();
