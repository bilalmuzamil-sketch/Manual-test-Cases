import { login, api } from './qa8582.mjs';
import fs from 'fs';
const t=await login('admin'); const S=t.sessCookie;
const HD='b3c8c820-f815-4cf1-8938-10956c5ee71a',LE='f8a8b802-7780-4b16-bf10-343caeb616b2';
let page=1, allInv=[];
while(page<=30){const r=await api(S,'GET',`/api/inventory/parts?pagination[page]=${page}&pagination[rowsPerPage]=500`);
 const c=r.body?.data?.collection||[]; allInv.push(...c); if(c.length<500)break; page++;}
const byId=Object.fromEntries(allInv.map(x=>[x.id,x]));
const withCore=allInv.filter(x=>x.core_part_id);
const coreTargetIds=[...new Set(withCore.map(x=>x.core_part_id))];
console.log('inventory parts:',allInv.length,'| parts carrying a core charge:',withCore.length,'| distinct core_part_id targets:',coreTargetIds.length);
console.log('sample keys:',Object.keys(allInv[0]).join(', '));
const targets=coreTargetIds.map(id=>byId[id]).filter(Boolean);
console.log('core-part records resolvable in the inventory list:',targets.length,'of',coreTargetIds.length);
const out=[];
for(const tp of targets){
  const pn=tp.part_number||tp.number;
  const r=await api(S,'GET',`/api/reporting/reports/parts-velocity?type=both&range=this_year&locations=${HD},${LE}&search=${encodeURIComponent(pn)}&pagination[page]=1&pagination[rowsPerPage]=50`);
  const rows=(r.body?.data?.collection||[]).filter(x=>x.part_number===pn);
  out.push({corePartNumber:pn, isCoreOf: withCore.filter(w=>w.core_part_id===tp.id).map(w=>w.part_number||w.number).slice(0,3),
    catalogOnHand: tp.quantity??tp.on_hand??null, coreChargeOnItself: tp.core_charge, presentInPV:rows.length,
    pvRows:rows.map(x=>({loc:x.location,oh:x.on_hand,us:x.units_sold,rev:x.revenue,demand:x.demand}))});
}
const present=out.filter(o=>o.presentInPV>0);
console.log('\nCORE PARTS (the core item itself) PRESENT IN PV:',present.length,'of',out.length);
console.log(JSON.stringify(out,null,1).slice(0,3500));
fs.writeFileSync('../evidence/pv/core-exclusion-targets.json',JSON.stringify({inventoryCount:allInv.length,partsCarryingCore:withCore.length,coreTargets:coreTargetIds.length,resolvable:targets.length,checks:out},null,1));
