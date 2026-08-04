import { login, api } from './qa8582.mjs';
import fs from 'fs';
const t=await login('admin'); const S=t.sessCookie;
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a',LE='f8a8b802-7780-4b16-bf10-343caeb616b2';
let page=1, cores=[];
while(page<=30){const r=await api(S,'GET',`/api/inventory/parts?pagination[page]=${page}&pagination[rowsPerPage]=500`);
 const c=r.body?.data?.collection||[]; cores.push(...c.filter(x=>Number(x.core_charge)>0||x.core_part_id)); if(c.length<500)break; page++;}
console.log('core-flagged inventory parts:',cores.length);
const out=[];
for(const cp of cores){
  const pn=cp.part_number||cp.number;
  const r=await api(S,'GET',`/api/reporting/reports/parts-velocity?type=both&range=this_year&locations=${HD},${LE}&search=${encodeURIComponent(pn)}&pagination[page]=1&pagination[rowsPerPage]=50`);
  const rows=(r.body?.data?.collection||[]).filter(x=>x.part_number===pn);
  out.push({pn, core_charge:cp.core_charge, on_hand_catalog:cp.quantity??cp.on_hand??null, presentInPV:rows.length, pvRows:rows.map(x=>({loc:x.location,oh:x.on_hand,us:x.units_sold,rev:x.revenue}))});
}
console.log(JSON.stringify(out,null,1));
// is the CORE part itself (core_part_id target) present?
const coreTargets=[...new Set(cores.map(c=>c.core_part_id).filter(Boolean))].slice(0,5);
console.log('sample core_part_id targets:',coreTargets.length);
fs.writeFileSync('../evidence/pv/core-exclusion.json',JSON.stringify({coreCount:cores.length,checks:out},null,1));
const present=out.filter(o=>o.presentInPV>0);
console.log('\nCORE PARTS PRESENT IN PV:',present.length,'of',out.length);
console.log(JSON.stringify(present,null,1).slice(0,2000));
