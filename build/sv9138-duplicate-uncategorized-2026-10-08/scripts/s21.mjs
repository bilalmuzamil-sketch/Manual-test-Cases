import {ob,j} from './lib.mjs';
const s=await ob(); const UN='b25c5c04-fe8d-4c21-a15c-a02c69f1ee5d';
const r=await s.api(`/api/parts-catalogue/categories/${UN}/remove`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}); console.log('remove default',r.status,j(r.json,300));
const c=await s.api('/api/parts-catalogue/change-category',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:UN,name:'Uncategorized Renamed',isTaxExempt:false})}); console.log('rename default',c.status,j(c.json,300));
const a=await s.api('/api/parts-catalogue/categories-list?search=uncateg&pagination%5BrowsPerPage%5D=50&pagination%5Bpage%5D=1'); console.log(JSON.stringify(a.json.data.collection.map(x=>[x.name,x.id,x.numberOfRelatedCatalogueParts,x.isDefault])));
await s.close();
