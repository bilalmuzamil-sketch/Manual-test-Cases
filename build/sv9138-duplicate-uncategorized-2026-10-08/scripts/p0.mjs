import {op,j} from './lib.mjs'; import fs from 'fs';
const s=await op(); console.log('marker',j(await s.marker()));
const a=await s.api('/api/parts-catalogue/categories-list?search=&pagination%5BrowsPerPage%5D=500&pagination%5Bpage%5D=1');
const c=a.json?.data?.collection||[]; fs.writeFileSync('/tmp/qa9138/prod-cats-before.json',JSON.stringify(c,null,1));
console.log('status',a.status,'total',c.length,'org',c[0]?.organizationId, JSON.stringify(c.filter(x=>/uncateg/i.test(x.name)).map(x=>[JSON.stringify(x.name),x.id,x.numberOfRelatedCatalogueParts,x.isDefault,x.deletable,x.editable])));
const p=await s.api('/api/inventory/parts?search=ZZ9138&limit=50'); console.log('zz parts on prod',(p.json?.data?.collection||[]).length);
await s.close();
