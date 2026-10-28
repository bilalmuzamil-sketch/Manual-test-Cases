// set-up: optional extra deposit, then canned line -> complete -> invoice on S.depWo (same chain as seed.mjs)
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,tag,extra]=process.argv.slice(2); const f=`/tmp/s11744/seed-${env}-${tag}.json`; const S=JSON.parse(fs.readFileSync(f,'utf8'));
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'11744',cookies,dir:(process.env.QA_DIR||'/tmp/qa23'),user:'bilal.muzamil@shopview.com'}); const p=s.page;
const post=(pp,b)=>s.api(pp,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const wo=S.depWo;
if(+extra>0){ const r=await post('/api/deposits',{work_order_id:wo,amount:+extra,payment_method:'CASH',deposit_date:new Date().toISOString().slice(0,10)}); console.log('deposit2',r.status,JSON.stringify(r.json).slice(0,200)); }
let cl=await s.api('/api/work-orders/canned-lines'); const cls=(cl.json?.data?.collection||cl.json?.data||[]);
const ln=await post(`/api/work-orders/${wo}/lines/create-from-canned-line`,{canned_line_id:cls[1].id||cls[1].value,status:'authorized'}); console.log('line',ln.status);
const pr=await s.api(`/api/work-orders/${wo}/parts/list-requests-by-line`);
for(const L of (pr.json?.data?.collection||[])) for(const q of (L.part_requests||[])) await post(`/api/work-orders/part/remove-request/${q.id}`,{});
await post('/api/work-orders/change-mileage',{work_order_id:wo,mileage:'123456'});
for(const L of ((await s.api(`/api/work-orders/lines/${wo}`)).json?.data?.collection||[])){ await post('/api/work-orders/lines/change-story',{line_id:L.line_id,tech_story:'ZZAUTOTEST done',work_order_id:wo}); await post('/api/work-orders/lines/change-status',{line_id:L.line_id,work_order_id:wo,status:'complete'}); }
const cs=await post('/api/work-orders/change-status',{id:wo,status:'complete'}); console.log('complete',cs.status,JSON.stringify(cs.json||'').slice(0,200));
const inv=await post('/api/invoices/create',{work_order_id:wo}); console.log('invoice',inv.status,JSON.stringify(inv.json||'').slice(0,400)); S.depInv=inv.json; fs.writeFileSync(f,JSON.stringify(S));
await s.close();
