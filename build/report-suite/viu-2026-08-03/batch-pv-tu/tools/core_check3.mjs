import { login, api } from './qa8582.mjs';
import fs from 'fs';
const t=await login('admin'); const S=t.sessCookie;
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a',LE='f8a8b802-7780-4b16-bf10-343caeb616b2';
let page=1, allInv=[];
while(page<=30){const r=await api(S,'GET',`/api/inventory/parts?pagination[page]=${page}&pagination[rowsPerPage]=500`);
 const c=r.body?.data?.collection||[]; allInv.push(...c); if(c.length<500)break; page++;}
const isCore=allInv.filter(x=>x.is_core===true||x.is_core===1);
console.log('inventory parts:',allInv.length,'| is_core parts:',isCore.length);
const out=[];
for(const cp of isCore.slice(0,40)){
  const pn=cp.part_number||cp.name;
  const r=await api(S,'GET',`/api/reporting/reports/parts-velocity?type=both&range=this_year&locations=${HD},${LE}&search=${encodeURIComponent(pn)}&pagination[page]=1&pagination[rowsPerPage]=50`);
  const rows=(r.body?.data?.collection||[]).filter(x=>x.part_number===pn);
  out.push({pn, is_core:cp.is_core, oh:cp.quantity, presentInPV:rows.length, pvRows:rows.map(x=>({loc:x.location,oh:x.on_hand,us:x.units_sold,rev:x.revenue,d:x.demand}))});
}
const present=out.filter(o=>o.presentInPV>0);
console.log('IS_CORE parts checked:',out.length,'| present in PV:',present.length);
console.log(JSON.stringify(out.slice(0,10),null,1));
// also: is_core parts with stock or activity (which would otherwise qualify for a row)
const wouldQualify=isCore.filter(x=>(x.quantity??0)>=1);
console.log('\nis_core parts with >=1 on hand (would otherwise qualify for a row):',wouldQualify.length,
  JSON.stringify(wouldQualify.slice(0,6).map(x=>({pn:x.part_number,oh:x.quantity}))));
fs.writeFileSync('../evidence/pv/core-exclusion-iscore.json',JSON.stringify({inventoryCount:allInv.length,isCoreCount:isCore.length,checked:out.length,presentInPV:present.length,checks:out,wouldQualify:wouldQualify.map(x=>({pn:x.part_number,oh:x.quantity}))},null,1));
