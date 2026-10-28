// Open only ON -> tick every open invoice -> New Payment: does the dialog open (not refused)?
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,tag]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/s11744/seed-${env}-${tag}.json`,'utf8'));
const cookies=JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8'));
const s=await open({env,ticket:'11744',cookies,dir:(process.env.QA_DIR||'/tmp/qa23'),user:'bilal.muzamil@shopview.com'}); const p=s.page;
const dir=`/tmp/s11744/${env}-${tag}`;
await s.go(`/customers/${S.cid}/invoices`); await p.waitForTimeout(3000);
const on=await p.evaluate(()=>document.querySelector('[data-test-id="toggle_filter_open_invoices"]')?.getAttribute('aria-checked')); if(on!=='true'){ const b=await s.box('toggle_filter_open_invoices'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(2000); }
const n=await p.evaluate(()=>document.querySelectorAll('[data-test-id="table-unpaid-transactions"] tbody tr').length);
for(let i=0;i<n;i++){ const b=await p.evaluate(ix=>{ const tr=document.querySelectorAll('[data-test-id="table-unpaid-transactions"] tbody tr')[ix]; if(!/Invoice/.test(tr.innerText)) return null; const c=tr.querySelector('.q-checkbox,[role=checkbox]'); const r=c.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; },i); if(b){ await p.mouse.click(b.x,b.y); await p.waitForTimeout(300);} }
await p.screenshot({path:`${dir}/newpay-ticked.png`});
const b=await s.box('button_new_payment'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(2500);
const dlg=await p.evaluate(()=>(document.querySelector('.q-dialog')?.innerText||'').replace(/\s+/g,' ').slice(0,500));
const toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ')));
await p.screenshot({path:`${dir}/newpay-result.png`});
let pay=null;
if(process.env.PAY&&dlg){ const caps=[]; p.on('response',async r=>{ if(/create-customer-payment/.test(r.url())) caps.push(r.status()+' '+(await r.text().catch(()=>'')).slice(0,300)); });
  const sb=await s.box('select_payment_method'); await p.mouse.click(sb.x,sb.y); await p.waitForTimeout(1200);
  const o=await p.evaluate(()=>{ const e=[...document.querySelectorAll('.q-menu .q-item')].find(x=>/^cash$/i.test((x.innerText||'').trim())); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; }); await p.mouse.click(o.x,o.y); await p.waitForTimeout(600);
  await p.fill('[data-test-id="input_memo"]','ZZAUTOTEST pay-all'); await p.keyboard.press('Tab'); await p.waitForTimeout(600);
  await p.screenshot({path:`${dir}/payall-ready.png`});
  const mk=await s.box('button_make_payment'); await p.mouse.click(mk.x,mk.y); await p.waitForTimeout(300);
  const t1=[]; for(let i=0;i<20;i++){ const t=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' '))); for(const x of t) if(!t1.includes(x)) t1.push(x); if(t.length) { await p.screenshot({path:`${dir}/payall-result.png`}); } await p.waitForTimeout(250); }
  pay={toasts:t1,responses:caps,dialogStillOpen:await p.evaluate(()=>!!document.querySelector('.q-dialog'))}; }
console.log(JSON.stringify({dialogOpened:!!dlg,dialog:dlg,toasts,pay}));
await s.close();
