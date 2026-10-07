import {ob,j} from './lib.mjs'; const s=await ob();
const P=(u,b)=>s.api(u,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const part=(await s.api('/api/inventory/parts?search=577.55547')).json.data.collection.find(x=>x.part_number==='577.55547');
console.log('part',j(part,1500));
console.log('probe',j(await P('/api/inventory/parts/change',{}),600));
await s.close();
