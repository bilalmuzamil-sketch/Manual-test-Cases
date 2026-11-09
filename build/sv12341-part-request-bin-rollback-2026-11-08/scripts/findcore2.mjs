import {sess} from './common.mjs'; const s=await sess(); let n=0;
for(let pg=1;pg<=8&&n<3;pg++){ const r=await s.api(`/api/inventory/parts?pagination[page]=${pg}&pagination[rowsPerPage]=200`); const a=r.json?.data?.collection||[]; if(!a.length) break;
 for(const x of a){ if(x.core_part_id&&(x.binLocations||[]).length){ n++; console.log('CORE',x.id,x.part_number,'q',x.quantity,'cat',x.category,'core',x.core_part_id,x.core_charge,JSON.stringify(x.binLocations)); if(n>=3) break; } } console.log('page',pg,a.length); }
await s.close();
