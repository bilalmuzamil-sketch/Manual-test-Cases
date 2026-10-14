import {ob,J,post} from './lib.mjs'; import {loc,reversePaymentUI} from './seed.mjs'; import {clearAssetContact} from './teardown.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('A2.json')); const s=await ob(); const p=s.page; await loc(s);
const ok=(t,r)=>{console.log(t,r.status,J(r.json,250)); return r;};
ok('contact',await post(s,'/api/work-orders/change-contact',{work_order_id:A.ps_id,vehicle_id:A.vehicle_id,contact_id:A.contact_id,update_vehicle:false}));
ok('approved',await post(s,'/api/work-orders/change-status',{id:A.ps_id,status:'approved'}));
ok('complete',await post(s,'/api/work-orders/change-status',{id:A.ps_id,status:'complete'}));
const inv=ok('invoice',await post(s,'/api/invoices/create',{work_order_id:A.ps_id})); A.invoice_id=inv.json?.data?.invoice_id; A.customer_account_id=inv.json?.data?.customer_account_id;
fs.writeFileSync('A2.json',JSON.stringify(A));
// pay on screen from the customer's Invoices tab
await s.go('/customers/'+A.company_id+'/invoices'); await p.waitForTimeout(3500);
const cb=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="checkbox_select_transaction_"],[data-test-id^="checkbox_"]')].map(e=>e.getAttribute('data-test-id')));
console.log('checkboxes',J(cb,300));
await s.close();
