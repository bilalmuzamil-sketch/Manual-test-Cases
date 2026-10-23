import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'11685',cookies:JSON.parse(fs.readFileSync('/tmp/qa11685/cookies.json')),quick:'tech',dir:'/tmp/qa21',vp:{width:1440,height:1000}});
const fp=await s.api('/api/auth/me/fe-permissions'); console.log('fe-perm',fp.status,JSON.stringify(fp.json).slice(0,700));
const wo=fs.readFileSync('/tmp/qa11685/w/seed-wo.txt','utf8').trim();
const e=await s.api('/api/work-orders/invoices/estimate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({work_order_id:wo,type:'html',isEstimate:1,includeDeclined:1,issueDate:'2026-10-23',dueDate:'2026-11-22',historyEvent:null})});
const i=await s.api('/api/invoices/preview?invoice_id=a4c6bc89-5976-4f35-8089-021e6dcd9dbe&type=html&isEstimate=0&includeDeclined=0&historyEvent=');
if(e.text) fs.writeFileSync('/tmp/qa11685/w/tech-est.html',e.text); if(i.text) fs.writeFileSync('/tmp/qa11685/w/tech-inv.html',i.text);
console.log('estimate as tech',e.status,e.text?'html '+e.text.length:JSON.stringify(e.json).slice(0,200)); console.log('invoice as tech',i.status,i.text?'html '+i.text.length:JSON.stringify(i.json).slice(0,200));
process.exit(0);
