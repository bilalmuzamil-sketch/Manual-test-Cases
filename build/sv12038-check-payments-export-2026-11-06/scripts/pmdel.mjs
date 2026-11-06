import {sess} from './common.mjs'; const s=await sess(); const p=s.page; const NAME=process.env.NAME; const reqs=[];
p.on('response',async r=>{ if(/payment-methods\//.test(r.url())&&r.request().method()!=='GET') reqs.push(r.status()+' '+r.request().method()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' '+(r.request().postData()||'')+' => '+(await r.text().catch(()=>'')).slice(0,200)); });
await s.go('/administration/payment-methods'); await p.waitForTimeout(5000);
if(process.env.VENDOR){ await p.click('[data-test-id="tab_vendor_payments"]'); await p.waitForTimeout(3000); }
const ids=await p.evaluate(n=>[...document.querySelectorAll('tr')].filter(tr=>tr.innerText.trim()===n||tr.querySelector('td')?.innerText.trim()===n).map(tr=>[...tr.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id'))),NAME); console.log('row',JSON.stringify(ids));
const btn=p.locator('tr',{hasText:NAME}).filter({has:p.locator('td',{hasText:new RegExp('^'+NAME+'$')})}).locator('button, i, [role=button]').last(); await btn.click(); await p.waitForTimeout(1500);
console.log('dlg',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(a=>a.getAttribute('data-test-id')+'='+(a.innerText||'').replace(/\s+/g,' ').trim().slice(0,60)))));
const r=await s.confirm('button_confirm_dialog').catch(e=>String(e)); await p.waitForTimeout(2500); console.log(reqs.join('\n')); await s.close(); process.exit(0);
