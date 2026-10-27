import {sess} from './lib.mjs'; const s=await sess();
for(const p of ['/api/inventory/bin-locations?pagination[rowsPerPage]=5&pagination[page]=1','/api/inventory/bin-locations','/api/vendors?pagination[rowsPerPage]=5&pagination[page]=1','/api/parts-catalogue/vendors?pagination[rowsPerPage]=5&pagination[page]=1']){const r=await s.api(p); console.log(p,r.status,JSON.stringify(r.json??r.text).slice(0,260));}
await s.browser.close(); process.exit(0);
