import {os,J,post} from './lib.mjs';
const s=await os(); await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
for(const q of ['limit=100&page=2','pagination[rowsPerPage]=100&pagination[page]=2','rowsPerPage=100&page=2']){ const d=(await s.api('/api/inventory/parts?'+q)).json?.data; console.log(q,(d?.collection||[]).length,J((d?.collection||[]).slice(0,2).map(p=>p.id),120),J(d?.pagination||d?.meta||Object.keys(d||{}),200)); }
await s.close();
