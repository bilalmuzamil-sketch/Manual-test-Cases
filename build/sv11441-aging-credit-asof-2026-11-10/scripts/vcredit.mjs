// on screen: Vendor > Unpaid Invoices > New Credit; optional DATE; capture request
import {sess} from './common.mjs';
const V=process.env.V||'98c705a1-ba42-42c1-b291-303deb797d3b', AMT=process.env.AMT||'3.21';
const s=await sess(); const p=s.page; const caps=[]; p.on('response',async r=>{ if(r.request().method()==='POST'&&!/collect|recent-entities/.test(r.url())){ let b='';try{b=(await r.text()).slice(0,200)}catch{} caps.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' :: '+(r.request().postData()||'').slice(0,250)+' -> '+b);} });
await s.go('/parts/vendor/'+V+'/unpaid-invoices'); await p.waitForTimeout(6000);
await p.click('[data-test-id="button_new_credit_vendor"]'); await p.waitForTimeout(2500);
const dlg=()=>p.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?[...d.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')+'='+(e.querySelector('input,textarea')?.value??e.value??e.innerText??'').toString().replace(/\s+/g,' ').slice(0,40)):null;});
console.log('dialog',JSON.stringify(await dlg()));
const inp=id=>p.locator(`.q-dialog [data-test-id="${id}"] input, .q-dialog [data-test-id="${id}"] textarea, .q-dialog input[data-test-id="${id}"], .q-dialog textarea[data-test-id="${id}"]`).first();
if(process.env.DATE){ const ids=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(x=>/date/i.test(x)&&/input/.test(x))); console.log('dateids',ids); if(ids[0]){ const d=inp(ids[0]); await d.click(); await p.keyboard.press('Control+A'); await p.keyboard.type(process.env.DATE,{delay:40}); await p.keyboard.press('Tab'); } }
await inp('input_credit_amount').fill(AMT); if(await inp('input_credit_memo').count()) await inp('input_credit_memo').fill('ZZAUTOTEST SV-11441 '+(process.env.DATE||'today'));
await p.waitForTimeout(800); console.log('filled',JSON.stringify(await dlg()));
const btns=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].map(b=>(b.getAttribute('data-test-id')||'')+'='+b.innerText.trim()+(b.disabled?' [disabled]':''))); console.log('btns',btns);
const save=p.locator('.q-dialog button').filter({hasText:/save|create|confirm|add/i}).last(); await save.click({timeout:8000}); await p.waitForTimeout(3000);
console.log('after',JSON.stringify(await dlg())); console.log(caps.join('\n')); await s.close(); process.exit(0);
