// set-up: take a deposit (API) on a work order of the seed, then show the Invoices tab rows
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,tag,woIdx,amt]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/s11744/seed-${env}-${tag}.json`,'utf8'));
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'11744',cookies,dir:(process.env.QA_DIR||'/tmp/qa23'),user:'bilal.muzamil@shopview.com'}); const p=s.page;
const post=(pp,b)=>s.api(pp,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const wo=S.wos[+woIdx].wo;
const r=await post('/api/deposits',{work_order_id:wo,amount:+amt,payment_method:'CASH',deposit_date:new Date().toISOString().slice(0,10)});
console.log('deposit',r.status,JSON.stringify(r.json||r.text).slice(0,400));
await s.go(`/customers/${S.cid}/invoices`); await p.waitForTimeout(3000);
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id="table-unpaid-transactions"] tbody tr')].map(tr=>(tr.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean))));
await s.close();
