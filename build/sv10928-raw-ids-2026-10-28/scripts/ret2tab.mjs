// Combined credit in two tabs: tab A opens the combined credit (work-order return + manual return); tab B credits the manual
// return on its own; then tab A posts -> message. usage: node ret2tab.mjs <env> <woReturnId> <manualReturnId>
import {open} from '../../testing-tools/qa-session.mjs'; import fs from 'fs';
const [env,wr,mr]=process.argv.slice(2); const out=`/tmp/s10928/${env}-returns`; fs.mkdirSync(out,{recursive:true});
const s=await open({env,ticket:'10928',cookies:JSON.parse(fs.readFileSync('/tmp/qa11631/cookies.json','utf8')),dir:(process.env.QA_DIR||'/tmp/qa24'),user:'bilal.muzamil@shopview.com'}); const A=s.page; const R={env};
const fillIn=async(pg,t,v)=>{ const l=pg.locator(`[data-test-id="${t}"] input, input[data-test-id="${t}"]`).first(); await l.click(); await l.fill(v); };
const toastsOf=async pg=>{ const t=[]; for(let i=0;i<24;i++){ for(const x of await pg.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim()))) if(!t.includes(x)) t.push(x); await pg.waitForTimeout(250);} return t; };
const watch=(pg,tag)=>pg.on('response',async r=>{ if(r.request().method()==='POST'&&/shopview\.com\/api\//.test(r.url())) (R[tag+'Posts']=R[tag+'Posts']||[]).push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(await r.text().catch(()=>'')).slice(0,300)); });
await s.go(`/parts/confirm-return?ids=${wr}&manualIds=${mr}&isManualReturn=0`); await A.waitForTimeout(5000);
await fillIn(A,'input_credit_memo_number','ZZCM-A-'+(Date.now()%10000)); await A.waitForTimeout(500); await A.screenshot({path:out+'/A-combined.png'}); watch(A,'A');
const B=await s.ctx.newPage(); watch(B,'B');
if(process.env.MODE==='cancel'){ await B.goto(s.host.app+'/parts/returns',{waitUntil:'domcontentloaded'}); await B.waitForTimeout(6000);
  const k=B.locator(`[data-test-id="button_manual_return_actions_${mr}"]`); await k.scrollIntoViewIfNeeded(); await k.click(); await B.waitForTimeout(1200);
  R.menuB=await B.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').trim()));
  const it=B.locator('.q-menu .q-item',{hasText:/cancel|delete|remove/i}).first(); await it.click(); await B.waitForTimeout(1200);
  for(let i=0;i<3;i++){ const btn=B.locator('.q-dialog button',{hasText:/^(Yes|Confirm|Are You Sure\?|Cancel Return|Delete|Remove)$/i}).last(); if(await btn.count()){ await btn.click(); await B.waitForTimeout(1200);} }
  R.toastsB=await toastsOf(B); await B.screenshot({path:out+'/B-cancelled.png'});
} else {
await B.goto(s.host.app+`/parts/confirm-return?id=${mr}&isManualReturn=1`,{waitUntil:'domcontentloaded'}); await B.waitForTimeout(6000);
await fillIn(B,'input_credit_memo_number','ZZCM-B-'+(Date.now()%10000)); await B.waitForTimeout(500);
await B.locator('[data-test-id="button_post_credit"]').click(); R.toastsB=await toastsOf(B); await B.screenshot({path:out+'/B-posted.png'}); }
await A.locator('[data-test-id="button_post_credit"]').click(); R.toastsA=await toastsOf(A); await A.screenshot({path:out+'/A-error.png'});
console.log(JSON.stringify(R,null,1).slice(0,3000)); fs.writeFileSync(out+'/ret2tab.json',JSON.stringify(R,null,1)); await s.close();
