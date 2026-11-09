import {sess} from './common.mjs'; const s=await sess(); console.log('marker',JSON.stringify(await s.marker()));
const WO='e4215cb8-1388-4db9-b69d-fc5b93c0a121';
const l=await s.api(`/api/work-orders/lines/${WO}`); console.log('lines',(l.json?.data?.collection||[]).slice(0,4).map(x=>`${x.id}|${x.status}|${(x.title||x.name||'').slice(0,30)}|pr=${(x.part_requests||[]).length}`).join(' ; '));
const r=await s.api('/api/inventory/parts?pagination[page]=1&pagination[rowsPerPage]=50'); const a=r.json?.data?.collection||r.json?.data?.parts||[];
for(const x of a.filter(x=>(x.quantity??0)>3).slice(0,4)){ const d=(await s.api(`/api/inventory/parts/${x.id}`)).json?.data||{}; console.log('part',x.id,x.partNumber||x.part_number,x.quantity,'cat',d.categoryId||d.category_id||d.part?.categoryId||JSON.stringify(d.category||d.part?.category||'').slice(0,80),'bins',JSON.stringify(d.bins||d.part?.bins||[]).slice(0,250)); }
await s.close();
