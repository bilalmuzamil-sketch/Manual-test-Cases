import {op,j} from './lib.mjs'; import fs from 'fs';
const s=await op(); const H={method:'POST',headers:{'Content-Type':'application/json'}};
const parts=JSON.parse(fs.readFileSync('/tmp/qa9138/prod-zzparts.json'));
for(const x of parts){ const r=await s.api('/api/inventory/parts/delete',{...H,body:JSON.stringify({id:x.id})}); console.log('inv del',x.part_number,r.status,j(r.json,150));
  const c=await s.api('/api/parts-catalogue/remove-catalogue-part?id='+x.catalogue_part_id,{...H,body:'{}'}); console.log('cat del',x.part_number,c.status,j(c.json,150)); }
const pp=await s.api('/api/inventory/parts?search=ZZ9138P&limit=50'); console.log('zz inv left',(pp.json?.data?.collection||[]).length);
let a=await s.api('/api/parts-catalogue/categories-list?search=&pagination%5BrowsPerPage%5D=500&pagination%5Bpage%5D=1');
const copies=a.json.data.collection.filter(x=>/uncateg/i.test(x.name)&&!x.isDefault); console.log('copies',JSON.stringify(copies.map(x=>[JSON.stringify(x.name),x.id,x.numberOfRelatedCatalogueParts])));
for(const c of copies){ if(c.numberOfRelatedCatalogueParts!==0){console.log('SKIP non-empty',c.id); continue;} const r=await s.api(`/api/parts-catalogue/categories/${c.id}/remove`,{...H,body:'{}'}); console.log('cat remove',c.id,r.status,j(r.json,150)); }
a=await s.api('/api/parts-catalogue/categories-list?search=&pagination%5BrowsPerPage%5D=500&pagination%5Bpage%5D=1'); const after=a.json.data.collection;
const before=JSON.parse(fs.readFileSync('/tmp/qa9138/prod-cats-before.json'));
const strip=x=>JSON.stringify(x.map(c=>({...c})).sort((p,q)=>p.id<q.id?-1:1));
console.log('after total',after.length,'before',before.length,'ids equal',JSON.stringify(after.map(x=>x.id).sort())===JSON.stringify(before.map(x=>x.id).sort()),'full rows equal',strip(after)===strip(before));
const un=after.find(x=>x.isDefault); console.log('default now',un.name,un.numberOfRelatedCatalogueParts,'was',before.find(x=>x.isDefault).numberOfRelatedCatalogueParts);
fs.writeFileSync('/tmp/qa9138/prod-cats-restored.json',JSON.stringify(after,null,1));
await s.close();
