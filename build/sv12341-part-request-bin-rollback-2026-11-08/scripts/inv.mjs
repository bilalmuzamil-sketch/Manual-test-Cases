import {sess} from './common.mjs';
const s=await sess();
const r=await s.api('/api/inventory/parts?pagination[page]=1&pagination[rowsPerPage]=50');
console.log(r.status, Object.keys(r.json?.data||{}));
const rows=r.json?.data?.collection||r.json?.data?.parts||r.json?.data||[];
const a=Array.isArray(rows)?rows:[]; console.log('n',a.length, a[0]?JSON.stringify(a[0]).slice(0,900):'');
for(const x of a.slice(0,50)){ const q=x.quantity??x.qty??x.onHand??x.available; if(q>2) console.log(x.id,x.partNumber||x.part_number,x.description,q); }
await s.close();
