import {os,J,post} from './lib.mjs';
const s=await os(); await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
for(const b of [{},{return_id:'1b285dfe-0259-427f-a3b3-527850aea3b9'},{return_id:'1b285dfe-0259-427f-a3b3-527850aea3b9',quantity:1,work_order_part_id:'x'},{return_id:'1b285dfe-0259-427f-a3b3-527850aea3b9',quantity:1,part_id:'00000000-0000-0000-0000-000000000000'}]){
 const r=await post(s,'/api/inventory/returns/add-item',b,{'X-Location-ID':'b3c8c820-f815-4cf1-8938-10956c5ee71a'}); console.log(J(Object.keys(b)),'->',r.status,J(r.json,400)); }
await s.close();
