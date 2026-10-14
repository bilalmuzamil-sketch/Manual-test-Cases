import {ob,J,post} from './lib.mjs';
const s=await ob();
const WP='b3c8c820-f815-4cf1-8938-10956c5ee71a';
await post(s,'/api/iam/change-location',{workplace_id:WP,workplace_timezone:'America/Edmonton'});
for (const u of ['/api/customer-account/create-customer-payment','/api/customer-account/reverse-customer-payment','/api/work-orders/lines/delete','/api/vehicles/create','/api/contacts/create','/api/work-orders/lines/create','/api/deposits','/api/customers/delete']) {
  const r=await post(s,u,{}); console.log(u,r.status,J(r.json,300));
}
const cl=await s.api('/api/work-orders/canned-lines?limit=5'); console.log('canned',cl.status,J(cl.json,400));
await s.close();
