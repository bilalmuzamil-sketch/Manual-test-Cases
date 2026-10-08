import {ob,j} from './lib.mjs';
const s=await ob();
const r=await s.api('/api/parts-catalogue/categories-list?search=uncateg&pagination%5BrowsPerPage%5D=100&pagination%5Bpage%5D=1');
console.log(j(r,3000));
const a=await s.api('/api/parts-catalogue/categories-list?search=&pagination%5BrowsPerPage%5D=200&pagination%5Bpage%5D=1');
const c=a.json?.data?.collection||a.json?.data||[]; console.log('total',a.json?.data?.pagination?.rowsNumber ?? c.length, 'keys', Object.keys(c[0]||{}));
console.log(j(c.slice(0,3),900));
await s.close();
