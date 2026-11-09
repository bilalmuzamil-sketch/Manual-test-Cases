import {sess} from './common.mjs'; const s=await sess(); let n=0;
for(let pg=1;pg<=6&&n<2;pg++){ const r=await s.api(`/api/inventory/parts?pagination[page]=${pg}&pagination[rowsPerPage]=200`); const a=r.json?.data?.collection||r.json?.data?.parts||[];
 if(pg===1) console.log('row keys',Object.keys(a[0]||{}).join(','));
 for(const x of a){ if((x.quantity??0)<2) continue; if(!(x.core_charge>0||x.coreCharge>0||x.core_part_id||x.corePartId||x.hasCore)) continue; const d=(await s.api(`/api/inventory/parts/${x.id}`)).json?.data?.part||{}; if(!d.core_part_id) continue; n++; console.log('CORE',x.id,x.partNumber||x.part_number,d.quantity,d.category,d.core_part_id,d.core_charge,JSON.stringify(d.binLocations)); if(n>=2) break; } }
await s.close();
