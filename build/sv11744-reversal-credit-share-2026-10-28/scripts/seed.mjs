// SV-11744 seed: fresh customer + contact + asset; N invoiced work orders (one canned line each)
// usage: node seed.mjs <env> <tag> <nInvoices>
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,tag,n]=[process.argv[2],process.argv[3],+process.argv[4]||2]; const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'11744',cookies,dir:(process.env.QA_DIR||'/tmp/qa23'),user:'bilal.muzamil@shopview.com'});
const post=(p,b)=>s.api(p,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const must=(k,r)=>{ if(r.status>=300){ console.log('FAIL',k,r.status,JSON.stringify(r.json||r.text).slice(0,300)); process.exit(1);} return r.json; };
const wp=(await s.api('/api/staff/my-workplaces')).json.data.collection[0];
const cid=must('customer',await post('/api/customers/create',{name:`ZZAUTOTEST SV11744 ${tag}`})).data.company_id;
const ct=must('contact',await post('/api/contacts/create',{company_id:cid,first_name:'Zz',last_name:tag,email:`zz11744.${tag.toLowerCase()}.${Date.now()}@example.com`})).data.contact_id;
const vid=must('vehicle',await post('/api/vehicles/create',{company_id:cid,customer_id:ct,unit:'Z'+tag})).data.id;
let cl=await s.api('/api/work-orders/canned-lines'); if(cl.status!==200) cl=await s.api('/api/canned-lines?limit=50');
const cls=(cl.json?.data?.collection||cl.json?.data||[]); console.log('canned lines',cl.status,cls.length);
const view=await s.api(`/api/customers/view/${cid}`); const acct=view.json?.data?.company?.customer_account_id||view.json?.data?.customer_account_id||JSON.stringify(view.json).match(/"(customer_)?account_?[iI]d":"([0-9a-f-]{36})"/)?.[2];
const out={env,tag,cid,ct,vid,acct,wos:[]};
for(let i=0;i<n;i++){
  const wo=must('wo',await post('/api/work-orders/create',{company_id:cid,customer_id:ct,vehicle_id:vid,workplace_id:wp.id,start_date:new Date().toISOString().slice(0,19).replace('T',' '),is_vehicle_here:true})).data.work_order_id;
  const c=cls[i%cls.length]; const ln=await post(`/api/work-orders/${wo}/lines/create-from-canned-line`,{canned_line_id:c.id||c.value,status:'authorized'}); console.log('line',ln.status,(c.name||c.label||'').slice(0,40));
  const pr=await s.api(`/api/work-orders/${wo}/parts/list-requests-by-line`);
  for(const L of (pr.json?.data?.collection||[])) for(const q of (L.part_requests||[])){ const r=await post(`/api/work-orders/part/remove-request/${q.id}`,{}); if(r.status>=300) console.log('remove part',r.status,JSON.stringify(r.json).slice(0,120)); }
  await post('/api/work-orders/change-mileage',{work_order_id:wo,mileage:'123456'});
  const lines=(await s.api(`/api/work-orders/lines/${wo}`)).json?.data?.collection||[];
  for(const L of lines){ await post('/api/work-orders/lines/change-story',{line_id:L.line_id,tech_story:'ZZAUTOTEST done',work_order_id:wo}); const r=await post('/api/work-orders/lines/change-status',{line_id:L.line_id,work_order_id:wo,status:'complete'}); if(r.status>=300) console.log('line complete',r.status,JSON.stringify(r.json).slice(0,160)); }
  const cs=await post('/api/work-orders/change-status',{id:wo,status:'complete'}); console.log('complete',cs.status,JSON.stringify(cs.json||'').slice(0,150));
  const inv=await post('/api/invoices/create',{work_order_id:wo}); console.log('invoice',inv.status,JSON.stringify(inv.json||'').slice(0,150));
  out.wos.push({wo,inv:inv.json}); await s.page.waitForTimeout(800); }
const ut=await s.api(`/api/customer-account/list-unpaid-transaction?accountId=${acct}&pagination%5BrowsPerPage%5D=1000`);
console.log('acct',acct,'unpaid',ut.status,JSON.stringify(ut.json).slice(0,700));
out.unpaid=ut.json; fs.writeFileSync(`/tmp/s11744/seed-${env}-${tag}.json`,JSON.stringify(out)); await s.close();
