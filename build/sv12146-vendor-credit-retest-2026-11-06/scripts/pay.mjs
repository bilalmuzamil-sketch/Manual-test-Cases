// node pay.mjs <vendorId> <tag> <rowText1> [rowText2...] -> ticks the Unpaid Invoices rows whose text contains each rowText, opens New Payment, dumps controls+text
import {sess} from './common.mjs'; const s=await sess({vp:{width:1600,height:1000}}); const p=s.page; const [vid,tag,...rows]=process.argv.slice(2);
p.on('request',r=>{ if(r.method()==='POST'&&/sv11839api/.test(r.url())&&!/touch/.test(r.url())) console.log('REQ',r.url().replace(/^https:\/\/[^/]+/,''),(r.postData()||'').slice(0,900)); });
p.on('response',async r=>{ if(r.request().method()==='POST'&&/sv11839api/.test(r.url())&&!/touch/.test(r.url())) console.log('RES',r.status(),(await r.text()).slice(0,300)); });
await s.go(`/parts/vendor/${vid}/unpaid-invoices`); await p.waitForTimeout(3500);
const rt=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id=table-unpaid-transactions] tbody tr')].map(tr=>tr.innerText.replace(/\s+/g,' '))); console.log('ROWS',JSON.stringify(rt));
for(const t of rows){ const tr=p.locator('[data-test-id=table-unpaid-transactions] tbody tr',{hasText:t}).first(); await tr.locator('.q-checkbox').first().click(); await p.waitForTimeout(500); }
await p.screenshot({path:`../ev/pay-${tag}-0.png`});
await p.click('[data-test-id=button_new_payment]'); await p.waitForTimeout(2500);
const ids=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')+(e.disabled?'(dis)':''))); console.log('PAY IDS',ids.join(' '));
const txt=await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText||''); console.log('PAY TEXT',txt.replace(/\n+/g,' | ').slice(0,2000));
await p.screenshot({path:`../ev/pay-${tag}-1.png`});
await s.close(); process.exit(0);
