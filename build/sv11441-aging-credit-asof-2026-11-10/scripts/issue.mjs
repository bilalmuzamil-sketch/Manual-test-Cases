// on screen: Customer > Invoices tab > Issue Credit, amount + memo, submit; capture request
import {sess} from './common.mjs';
const CUST=process.env.CUST||'4255e024-938c-4514-83d9-95f1a0a7f324', AMT=process.env.AMT||'12.34';
const s=await sess(); const p=s.page; const caps=[]; p.on('response',async r=>{ if(r.request().method()==='POST'&&!/collect|recent-entities/.test(r.url())){ let b='';try{b=(await r.text()).slice(0,250)}catch{} caps.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' :: '+(r.request().postData()||'').slice(0,250)+' -> '+b);} });
await s.go('/customers/'+CUST+'/invoices'); await p.waitForTimeout(6000);
await p.click('[data-test-id="button_issue_credit_customer"]'); await p.waitForTimeout(2500);
const dlg=()=>p.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?[...d.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')+'='+(e.querySelector('input')?.value??e.value??e.innerText??'').toString().replace(/\s+/g,' ').slice(0,40)):null;});
console.log('dialog',JSON.stringify(await dlg()));
const inp=id=>p.locator(`.q-dialog [data-test-id="${id}"] input, .q-dialog [data-test-id="${id}"] textarea, .q-dialog input[data-test-id="${id}"], .q-dialog textarea[data-test-id="${id}"]`).first();
if(process.env.DATE){ const d=inp('date_input_credit_memo_date'); await d.click(); await p.keyboard.press('Control+A'); await p.keyboard.type(process.env.DATE,{delay:40}); await p.keyboard.press('Tab'); }
await inp('input_credit_memo_amount').fill(AMT); await inp('input_credit_memo_reason').fill('ZZAUTOTEST SV-11441 '+(process.env.DATE||'today'));
await p.click('.q-dialog [data-test-id="radio_credit_memo_outcome_hold"]').catch(e=>console.log('radio',e.message.slice(0,80))); await p.waitForTimeout(800); await p.hover('.q-dialog [data-test-id="button_confirm_dialog"]'); await p.waitForTimeout(1200); console.log('tooltip',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(t=>t.innerText)))); console.log('filled',JSON.stringify(await dlg())); await p.screenshot({path:'../ev/issue-credit-filled.png'});
const btn=p.locator('.q-dialog [data-test-id="button_confirm_dialog"]'); console.log('btn',await btn.getAttribute('data-test-id')); await btn.click({timeout:8000}); await p.waitForTimeout(3000);
for(let i=0;i<2;i++){ const d=await dlg(); if(!d) break; const c=p.locator('.q-dialog [data-test-id*="confirmation_answer"]'); if(await c.count()){ await c.first().click(); await p.waitForTimeout(2500);} else break; }
console.log('after',JSON.stringify(await dlg())); console.log(caps.join('\n')); await s.close(); process.exit(0);
