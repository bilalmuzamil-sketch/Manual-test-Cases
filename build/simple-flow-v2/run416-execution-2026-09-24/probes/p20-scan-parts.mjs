// Scan many work orders' lines and parts so the run can pick the right record for each check
// instead of seeding a new one (Rule 14: seed only what the branch does not already have).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const { browser, ctx, APIH } = await bootProdLogin('/workorders', { settle: 8000 });
const list = JSON.parse(fs.readFileSync(`${EV}/wo-list.json`,'utf8'));
const want = list.filter(w => (w.partRequestsCount||0) > 0).slice(0, 45);
const rows = [];
for (const w of want) {
  try {
    const r = await ctx.request.get(`https://${APIH}/api/work-orders/lines/${w.id}`, {headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
    if (r.status() !== 200) continue;
    const j = await r.json();
    const lines = j.data?.collection || [];
    for (const l of lines) for (const p of (l.parts||[])) {
      rows.push({ wo: w.number, woId: w.id, woStatus: w.status, line: l.status, lineName: (l.name||'').slice(0,20),
                  part: (p.description||p.part_number||'').slice(0,24), status: p.status, status_val: p.status_val,
                  src: p.part_source_type, vendor: p.vendor_id, core: p.core_charge, inv: p.inventory_part_id });
    }
  } catch(e){}
}
fs.writeFileSync(`${EV}/part-scan.json`, JSON.stringify(rows,null,1));
const byStatus = {}; for (const r of rows) byStatus[r.status+' / '+r.status_val] = (byStatus[r.status+' / '+r.status_val]||0)+1;
console.log('parts scanned:', rows.length);
console.log('part statuses seen:', JSON.stringify(byStatus,null,1));
const byLine = {}; for (const r of rows) byLine[r.line?.label||r.line?.value||r.line] = (byLine[r.line?.label||r.line?.value||r.line]||0)+1;
console.log('line statuses seen:', JSON.stringify(byLine));
const bySrc = {}; for (const r of rows) bySrc[r.src] = (bySrc[r.src]||0)+1;
console.log('part sources seen:', JSON.stringify(bySrc));
console.log('with a vendor:', rows.filter(r=>r.vendor).length, '| with a core charge:', rows.filter(r=>Number(r.core)>0).length, '| from inventory:', rows.filter(r=>r.inv).length);
await browser.close();
