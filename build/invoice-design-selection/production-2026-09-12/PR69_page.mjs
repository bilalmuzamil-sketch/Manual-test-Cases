// PRODUCTION -- C53568. My previous search saw only 100 work orders however large the limit, so
// "not created" was not a claim I could make. Page through properly and search by the invoice number.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53568', pages:[], matches:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR69.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
// search first -- the list endpoint takes a search parameter in the UI
for(const q of ['ZZAUTOTEST','ZZAUTOTEST-IMP-C','IMP-C']){
  const r=await call(`/api/work-orders?search=${encodeURIComponent(q)}&limit=100`);
  const rows=r.s===200?rowsOf(r.j):[];
  L('search "%s" -> %s, %d rows: %s', q, r.s, rows.length, JSON.stringify(rows.slice(0,4).map(x=>x.number)));
  R.matches.push({q, n:rows.length, sample:rows.slice(0,4).map(x=>({n:x.number, st:x.status}))});
}
// then page the whole list
const seen=new Set(); let total=0;
for(let p=1;p<=12;p++){
  const r=await call(`/api/work-orders?limit=100&pagination%5Bpage%5D=${p}&pagination%5BrowsPerPage%5D=100`);
  const rows=r.s===200?rowsOf(r.j):[];
  const fresh=rows.filter(x=>!seen.has(x.id)); fresh.forEach(x=>seen.add(x.id));
  total+=fresh.length;
  R.pages.push({p, returned:rows.length, fresh:fresh.length});
  const hit=rows.filter(x=>/ZZAUTOTEST|IMP-C/i.test(JSON.stringify(x)));
  if(hit.length){ L('page %d: FOUND %s', p, JSON.stringify(hit.map(x=>({n:x.number,st:x.status,id:x.id}))));
    R.found=hit.map(x=>({n:x.number,st:x.status,id:x.id})); break; }
  L('page %d: %d rows (%d new), running total %d', p, rows.length, fresh.length, seen.size);
  if(!fresh.length) break;
}
R.distinctWorkOrders=seen.size;
L('distinct work orders reachable: %d | found the imported one: %s', seen.size, JSON.stringify(R.found||null));
save(); await browser.close();
