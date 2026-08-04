import { login, api } from './qa8582.mjs';
import fs from 'fs';
const t=await login('admin'); const S=t.sessCookie;
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a',LE='f8a8b802-7780-4b16-bf10-343caeb616b2';
const COREID='13baad92-fc7b-4261-a2be-91c4536283f4';
let page=1, all=[];
while(page<=30){const r=await api(S,'GET',`/api/inventory/parts?pagination[page]=${page}&pagination[rowsPerPage]=500`);
 const c=r.body?.data?.collection||[]; all.push(...c); if(c.length<500)break; page++;}
const core=all.find(x=>x.id===COREID);
console.log('core part record found in inventory list:', !!core);
console.log(core? JSON.stringify({id:core.id,pn:core.part_number,name:core.name,is_core:core.is_core,q:core.quantity,wp:core.workplace_id,core_charge:core.core_charge},null,1):'(absent from /api/inventory/parts)');
const isCore=all.filter(x=>x.is_core===true||x.is_core===1);
console.log('is_core==true parts now:', isCore.length, JSON.stringify(isCore.slice(0,5).map(x=>({pn:x.part_number,q:x.quantity}))));
// search PV for the core part's number/name
for(const term of [core?core.part_number:'ZZAUTOTEST', 'ZZAUTOTEST']){
  if(!term) continue;
  const r=await api(S,'GET',`/api/reporting/reports/parts-velocity?type=both&range=this_year&locations=${HD},${LE}&search=${encodeURIComponent(term)}&pagination[rowsPerPage]=30`);
  console.log(`PV search "${term}" ->`, JSON.stringify((r.body?.data?.collection||[]).map(x=>({pn:x.part_number,type:x.type,oh:x.on_hand}))));
}
fs.writeFileSync('../evidence/pv/core-exclusion-final.json',JSON.stringify({coreId:COREID, corePartRecord:core||null, isCoreCount:isCore.length, isCoreSample:isCore.slice(0,5).map(x=>({pn:x.part_number,q:x.quantity,id:x.id}))},null,1));
