// node pay2.mjs <vendorId> <tag> <credit> <method|-> <commit 0/1> <rowText...> -> tick rows, New Payment, fill Amount to credit, pick method, (save)
import {sess} from './common.mjs'; const s=await sess({vp:{width:1600,height:1000}}); const p=s.page; const [vid,tag,cred,meth,commit,...rows]=process.argv.slice(2);
p.on('request',r=>{ if(r.method()==='POST'&&/(sv11839api|api\.shopview\.com)/.test(r.url())&&!/touch/.test(r.url())) console.log('REQ',r.url().replace(/^https:\/\/[^/]+/,''),(r.postData()||'').slice(0,1200)); });
p.on('response',async r=>{ if(r.request().method()==='POST'&&/(sv11839api|api\.shopview\.com)/.test(r.url())&&!/touch/.test(r.url())) console.log('RES',r.status(),(await r.text()).slice(0,300)); });
await s.go(`/parts/vendor/${vid}/unpaid-invoices`); await p.waitForTimeout(3500);
for(const t of rows){ const tr=p.locator('[data-test-id=table-unpaid-transactions] tbody tr',{hasText:t}).first(); await tr.locator('.q-checkbox').first().click(); await p.waitForTimeout(400); }
await p.click('[data-test-id=button_new_payment]'); await p.waitForTimeout(2500);
await p.click('[data-test-id=select_payment_method]'); await p.waitForTimeout(800);
const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim())); console.log('METHODS',JSON.stringify(opts));
const m=meth==='-'?opts[0]:meth; await p.locator('.q-menu .q-item',{hasText:m}).first().click(); await p.waitForTimeout(600);
if(cred!=='-'){ await p.fill('[data-test-id=input_manually_entered_credit]',cred); await p.keyboard.press('Tab'); await p.waitForTimeout(800); }
const txt=await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText||''); console.log('PAY TEXT',txt.replace(/\s*\n\s*/g,' | ').slice(0,1500));
const st=await p.evaluate(()=>({btn:document.querySelector('[data-test-id=button_make_payment]')?.disabled, pay:document.querySelector('[data-test-id=input_payment_amount] input, input[data-test-id=input_payment_amount]')?.value}));
console.log('STATE',JSON.stringify(st)); await p.screenshot({path:`../ev/pay-${tag}-1.png`});
if(commit==='1'){ await p.click('[data-test-id=button_make_payment]'); await p.waitForTimeout(3000);
  const dlg=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s*\n\s*/g,' | ')).join(' || ')); console.log('AFTER',dlg.slice(0,800)); await p.screenshot({path:`../ev/pay-${tag}-2.png`}); }
await s.close(); process.exit(0);
