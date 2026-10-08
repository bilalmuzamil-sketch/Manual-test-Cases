import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob();
const a=await s.api('/api/parts-catalogue/categories-list?search=&pagination%5BrowsPerPage%5D=500&pagination%5Bpage%5D=1'); const c=a.json.data.collection;
fs.writeFileSync('/tmp/qa9138/cats-after-import.json',JSON.stringify(c,null,1));
console.log('after total',c.length,'uncat rows',JSON.stringify(c.filter(x=>/uncateg/i.test(x.name)).map(x=>[x.name,x.numberOfRelatedCatalogueParts,x.isDefault,x.deletable])),'zz',JSON.stringify(c.filter(x=>/zzauto/i.test(x.name)).map(x=>['['+x.name+']',x.numberOfRelatedCatalogueParts,x.id])),'HD-F',JSON.stringify(c.filter(x=>/fasteners/i.test(x.name)).map(x=>['['+x.name+']',x.numberOfRelatedCatalogueParts])));
const p=await s.api('/api/inventory/parts?search=ZZ9138&limit=50'); 
const col=p.json?.data?.collection||p.json?.data?.parts||p.json?.data; console.log(j(p.json,200));
fs.writeFileSync('/tmp/qa9138/zzparts.json',JSON.stringify(p.json,null,1));
await s.close();
