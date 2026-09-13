// PRODUCTION -- C53568. Positive control for the searches that found nothing: the SAME calls, with a
// term that must match. Without this, "the imported invoice is not there" is a claim about my search.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53568', controls:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR70.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
for(const q of ['S2-863','aqeel','ZZAUTOTEST-IMP-C']){
  const r=await call(`/api/work-orders?search=${encodeURIComponent(q)}&limit=100`);
  const rows=r.s===200?rowsOf(r.j):[];
  R.controls.push({q, status:r.s, rows:rows.length, sample:rows.slice(0,3).map(x=>x.number)});
  L('search "%-18s" -> %s, %d rows %s', q, r.s, rows.length, JSON.stringify(rows.slice(0,3).map(x=>x.number)));
}
R.searchWorks = R.controls[0].rows>0 || R.controls[1].rows>0;
L('does the search parameter work at all? %s', R.searchWorks);
save(); await browser.close();
