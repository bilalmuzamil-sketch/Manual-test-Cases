// SV-12341 extra matrix: complete line (reopening), multi-bin, cored part, part sale, auto-pick on. Logs request count, line status, stock.
import {sess} from './common.mjs'; import fs from 'fs';
const E=JSON.parse(process.env.CFG); const TAG=process.env.TAG; const s=await sess(); const out=[]; const L=x=>{out.push(x); console.log(x);};
L('marker '+JSON.stringify(await s.marker()));
const J=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const lines=async wo=>((await s.api(`/api/work-orders/lines/${wo}`)).json?.data?.collection||[]);
const reqs=async wo=>{ const ids=[]; for(const l of await lines(wo)) for(const q of (l.part_requests||[])) ids.push(q.id); return ids; };
const lstat=async(wo,lid)=>(await lines(wo)).find(l=>l.line_id===lid)?.status;
const stock=async inv=>{ const d=(await s.api(`/api/inventory/parts/${inv}`)).json?.data?.part||{}; return `${d.quantity} [${(d.binLocations||[]).map(b=>b.name+':'+b.quantity).join(',')}]`; };
const run=async(name,wo,lid,inv,body)=>{ const b0=await reqs(wo), s0=await stock(inv), l0=lid?await lstat(wo,lid):'-'; const r=await J('/api/work-orders/part/make-request',body);
  const b1=await reqs(wo), s1=await stock(inv), l1=lid?await lstat(wo,lid):'-'; const add=b1.filter(x=>!b0.includes(x));
  L(`${name}: HTTP ${r.status} ${JSON.stringify(r.json?.errors||r.json?.data?.id||r.text).slice(0,160)}`); L(`   requests ${b0.length}->${b1.length} new=${add.length} | line ${l0}->${l1} | stock ${s0} -> ${s1}`); return r; };
const base=(wo,lid,inv,cat)=>({work_order:wo,line:lid,description:'ZZAUTOTEST SV12341',part_source_type:'inventory',inventory_part_id:inv,part_category_id:cat,sell_price:50});
const NOBIN='11111111-2222-4333-8444-555555555555';
if(E.completeLine){ const c=E.completeLine; const r=await J('/api/work-orders/lines/change-status',{line_id:c.line,status:'complete',workOrderId:c.wo}); L(`set line complete: HTTP ${r.status} ${JSON.stringify(r.json).slice(0,120)} -> ${await lstat(c.wo,c.line)}`);
  await run('E1 rejected (missing bin) on a COMPLETE line',c.wo,c.line,c.inv,{...base(c.wo,c.line,c.inv,c.cat),quantity:1,bins:[{id:NOBIN,name:'Nowhere',quantity:1}]});
  await run('E2 rejected (wrong total) on a COMPLETE line',c.wo,c.line,c.inv,{...base(c.wo,c.line,c.inv,c.cat),quantity:2,bins:[{id:c.bin,name:c.binName,quantity:1}]});
  await run('E3 valid on a COMPLETE line',c.wo,c.line,c.inv,{...base(c.wo,c.line,c.inv,c.cat),quantity:1,bins:[{id:c.bin,name:c.binName,quantity:1}]}); }
if(E.multi){ const m=E.multi; await run('F1 two bins, totals match (2+1=3)',m.wo,m.line,m.inv,{...base(m.wo,m.line,m.inv,m.cat),quantity:3,bins:[{id:m.b1,name:m.n1,quantity:2},{id:m.b2,name:m.n2,quantity:1}]});
  await run('F2 two bins, totals wrong (2+2 vs 3)',m.wo,m.line,m.inv,{...base(m.wo,m.line,m.inv,m.cat),quantity:3,bins:[{id:m.b1,name:m.n1,quantity:2},{id:m.b2,name:m.n2,quantity:2}]});
  await run('F3 one good bin + one missing bin',m.wo,m.line,m.inv,{...base(m.wo,m.line,m.inv,m.cat),quantity:3,bins:[{id:m.b1,name:m.n1,quantity:2},{id:NOBIN,name:'Nowhere',quantity:1}]}); }
if(E.core){ const c=E.core; await run('G1 cored part, rejected (missing bin)',c.wo,c.line,c.inv,{...base(c.wo,c.line,c.inv,c.cat),quantity:1,bins:[{id:NOBIN,name:'Nowhere',quantity:1}]});
  await run('G2 cored part, valid',c.wo,c.line,c.inv,{...base(c.wo,c.line,c.inv,c.cat),quantity:1,bins:[{id:c.bin,name:c.binName,quantity:1}]}); }
if(E.ps){ const c=E.ps; await run('H1 part sale, rejected (missing bin)',c.wo,c.line,c.inv,{...base(c.wo,c.line,c.inv,c.cat),quantity:1,bins:[{id:NOBIN,name:'Nowhere',quantity:1}]});
  await run('H2 part sale, valid',c.wo,c.line,c.inv,{...base(c.wo,c.line,c.inv,c.cat),quantity:1,bins:[{id:c.bin,name:c.binName,quantity:1}]}); }
if(E.autopick){ const c=E.autopick; const S0=(await s.api('/api/organizations/settings')).json.data; const on=await J('/api/organizations/settings/change',{...S0,autoPickInventoryParts:true}); L(`auto-pick ON: HTTP ${on.status} now=${(await s.api('/api/organizations/settings')).json.data.autoPickInventoryParts}`);
  await run('K1 auto-pick on, rejected (missing bin)',c.wo,c.line,c.inv,{...base(c.wo,c.line,c.inv,c.cat),quantity:1,bins:[{id:NOBIN,name:'Nowhere',quantity:1}]});
  await run('K2 auto-pick on, rejected (wrong total)',c.wo,c.line,c.inv,{...base(c.wo,c.line,c.inv,c.cat),quantity:2,bins:[{id:c.bin,name:c.binName,quantity:1}]});
  const v=await run('K3 auto-pick on, valid',c.wo,c.line,c.inv,{...base(c.wo,c.line,c.inv,c.cat),quantity:1,bins:[{id:c.bin,name:c.binName,quantity:1}]}); L('   K3 picked? '+JSON.stringify(v.json?.data?.part_request?.status||v.json?.data?.status||'').slice(0,80));
  const off=await J('/api/organizations/settings/change',{...S0}); L(`auto-pick restored: HTTP ${off.status} now=${(await s.api('/api/organizations/settings')).json.data.autoPickInventoryParts}`); }
fs.writeFileSync(`../ev/${TAG}-bincases2.txt`,out.join('\n')+'\n'); await s.close();
