// SV-12341: a rejected bin allocation must leave nothing behind. Counts part requests on the work order and the part's stock before/after.
import {sess} from './common.mjs'; import fs from 'fs';
const WO=process.env.WO, LINE=process.env.LINE, INV=process.env.INV, BIN=process.env.BIN, CAT=process.env.CAT, TAG=process.env.TAG||'run';
const s=await sess(); const out=[]; const L=x=>{out.push(x); console.log(x);};
L('marker '+JSON.stringify(await s.marker()));
const reqs=async()=>{ const r=await s.api(`/api/work-orders/lines/${WO}`); const ids=[]; for(const l of (r.json?.data?.collection||[])) for(const q of (l.part_requests||[])) ids.push(q.id); return ids.sort(); };
const stock=async()=>{ const r=await s.api(`/api/inventory/parts/${INV}`); const d=r.json?.data||{}; return JSON.stringify({status:r.status, q:d.quantity??d.part?.quantity, avail:d.available??d.part?.available, bins:(d.bins||d.part?.bins||d.part?.binLocations||[]).map(b=>`${b.name||b.binLocationName}:${b.quantity}`)}); };
const mk=b=>s.api('/api/work-orders/part/make-request',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const base={work_order:WO,line:LINE,description:'ZZAUTOTEST SV12341',part_source_type:'inventory',inventory_part_id:INV,part_category_id:CAT,sell_price:180};
const cases=[
 ['A nonexistent bin id', {...base,quantity:1,bins:[{id:'11111111-2222-4333-8444-555555555555',name:'Nowhere',quantity:1}]}],
 ['B bin total 1 vs quantity 2', {...base,quantity:2,bins:[{id:BIN,name:process.env.BINNAME||'General Storage',quantity:1}]}],
 ['C bin quantity 0', {...base,quantity:1,bins:[{id:BIN,name:process.env.BINNAME||'General Storage',quantity:0}]}],
 ['D more than the bin holds', {...base,quantity:999,bins:[{id:BIN,name:process.env.BINNAME||'General Storage',quantity:999}]}],
 ['A again (resubmit)', {...base,quantity:1,bins:[{id:'11111111-2222-4333-8444-555555555555',name:'Nowhere',quantity:1}]}],
...(process.env.VALID?[['V valid: 1 from the bin', {...base,quantity:1,bins:[{id:BIN,name:process.env.BINNAME||'General Storage',quantity:1}]}]]:[]),
];
for(const [name,b] of cases){
  const before=await reqs(); const st0=await stock();
  const r=await mk(b);
  const after=await reqs(); const st1=await stock();
  const added=after.filter(x=>!before.includes(x));
  L(`${name}: HTTP ${r.status} ${JSON.stringify(r.json||r.text).slice(0,220)}`);
  L(`   part requests before ${before.length} after ${after.length} new=${JSON.stringify(added)}`);
  L(`   stock before ${st0}\n   stock after  ${st1}`);
}
fs.writeFileSync(`../ev/${TAG}-bincases.txt`,out.join('\n')+'\n'); await s.close();
