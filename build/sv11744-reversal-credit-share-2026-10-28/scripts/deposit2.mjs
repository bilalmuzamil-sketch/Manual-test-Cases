// set-up: new open work order for the seed customer + a deposit on it (API), then list the Invoices tab rows
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,tag,amt]=process.argv.slice(2); const f=`/tmp/s11744/seed-${env}-${tag}.json`; const S=JSON.parse(fs.readFileSync(f,'utf8'));
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'11744',cookies,dir:(process.env.QA_DIR||'/tmp/qa23'),user:'bilal.muzamil@shopview.com'}); const p=s.page;
const post=(pp,b)=>s.api(pp,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const wp=(await s.api('/api/staff/my-workplaces')).json.data.collection[0];
const wo=(await post('/api/work-orders/create',{company_id:S.cid,customer_id:S.ct,vehicle_id:S.vid,workplace_id:wp.id,start_date:new Date().toISOString().slice(0,19).replace('T',' '),is_vehicle_here:true})).json.data.work_order_id;
const st=await post('/api/work-orders/change-status',{id:wo,status:'approved'}); console.log('approve',st.status);
const r=await post('/api/deposits',{work_order_id:wo,amount:+amt,payment_method:'CASH',deposit_date:new Date().toISOString().slice(0,10)});
console.log('deposit',r.status,JSON.stringify(r.json||r.text).slice(0,400)); S.depWo=wo; S.dep=r.json; fs.writeFileSync(f,JSON.stringify(S));
await s.go(`/customers/${S.cid}/invoices`); await p.waitForTimeout(3000);
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id="table-unpaid-transactions"] tbody tr')].map(tr=>(tr.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean))));
await s.go(`/customers/${S.cid}`); await p.waitForTimeout(2500);
console.log('tabs',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="tab_"]')].map(e=>e.getAttribute('data-test-id')+':'+e.innerText.trim()))));
await s.close();
