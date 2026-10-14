import {os,J,post} from './lib.mjs';
const s=await os(); await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
const R='1b285dfe-0259-427f-a3b3-527850aea3b9', U='11111111-2222-4333-8444-555555555555';
for(const k of ['work_order_part_id','workOrderPartId','part_request_id','partRequestId','work_order_id','delivery_id','return_request_id','inventory_part_id']){
 const r=await post(s,'/api/inventory/returns/add-item',{return_id:R,quantity:1,[k]:U},{'X-Location-ID':'b3c8c820-f815-4cf1-8938-10956c5ee71a'}); console.log(k,'->',r.status,J(r.json,250)); }
await s.close();
