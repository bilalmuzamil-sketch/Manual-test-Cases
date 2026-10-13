import {op,J,post,setLoc} from './lib.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('wo1.json'));
const s=await op({dpr:1}); await setLoc(s);
const l=(await s.api('/api/work-orders/lines/'+W.wo)).json; const c=l.collection||l.data?.collection||[];
for(const ln of c){ console.log('line status',ln.status,'| parts:'); for(const p of [...(ln.parts||[])]) console.log('  ',p.id.slice(0,8),p.part_number,'status=',JSON.stringify(p.status),'part_category=',p.part_category,'qty=',p.quantity,'desc=',JSON.stringify(p.description),'cat=',p.part_category_id,'src=',p.part_source_type,'bins=',J(p.binAllocations,120)); }
for(const ln of c) for(const p of ln.parts||[]) console.log('STAGED',J(p,1500));
await s.close();
