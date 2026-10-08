import {ob,j} from './lib.mjs';
const s=await ob();
console.log('marker',j(await s.marker()));
const me=await s.api('/api/auth/me'); console.log('me',j(me,400));
for (const p of ['/api/parts-catalogue/categories?limit=200','/api/parts-catalogue/categories','/api/inventory/categories?limit=200']){
  const r=await s.api(p); console.log(p,j(r,1500));
}
await s.close();
