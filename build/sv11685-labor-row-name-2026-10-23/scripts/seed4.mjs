import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'admin',dir:'/tmp/qa21',vp:{width:1440,height:900}});
const wo=fs.readFileSync('/tmp/qa11685/w/seed-wo.txt','utf8').trim();
const r=await s.api('/api/work-orders/change-customer',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({work_order_id:wo,company_id:'4255e024-938c-4514-83d9-95f1a0a7f324',customer_id:'3710275e-bc7c-40f8-a5bb-4b3e7b7c4ab0'})});
console.log('change-customer',r.status,JSON.stringify(r.json||r.text).slice(0,200));
const v=(await s.api('/api/work-orders/view/'+wo)).json?.data?.work_order; console.log('customer',v.customer_id,v.customer_first_name,v.customer_last_name);
process.exit(0);
