import {os,J,post} from './lib.mjs';
const s=await os(); await post(s,'/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
const r=await post(s,'/api/inventory/returns/add-item',{return_id:'1b285dfe-0259-427f-a3b3-527850aea3b9',quantity:'2',return_request_id:'22222222-3333-4444-8555-666666666666',credits:10},{'X-Location-ID':'b3c8c820-f815-4cf1-8938-10956c5ee71a'}); console.log('rr branch',r.status,J(r.json,200));
await s.close();
