import {op,J,post,setLoc} from './lib.mjs';
const s=await op({dpr:1}); await setLoc(s);
console.log('marker',J(await s.marker()));
for(const u of ['/api/parts-catalogue/add-catalogue-part','/api/inventory/parts/create']){ const r=await post(s,u,{}); console.log(u,r.status,J(r.json,700)); }
const c=await s.api('/api/inventory/categories'); console.log('cats',c.status,J((c.json.data?.collection||c.json.data||[]).slice?.(0,4)||c.json,400));
const b=await s.api('/api/inventory/bins'); console.log('bins',b.status,J(b.json,400));
const p=await s.api('/api/inventory/parts?limit=3&search=920183'); console.log('920183',p.status,J(p.json,300));
await s.close();
