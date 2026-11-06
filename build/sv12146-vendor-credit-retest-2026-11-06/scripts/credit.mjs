// node credit.mjs <vendorId> <amount> <memo> -> New Credit on screen; then opens New Payment and lists its controls
import {sess} from './common.mjs'; const s=await sess({vp:{width:1600,height:1000}}); const p=s.page; const [vid,amt,memo]=process.argv.slice(2);
p.on('request',r=>{ if(r.method()==='POST'&&/(sv11839api|api\.shopview\.com)/.test(r.url())) console.log('REQ',r.url().replace(/^https:\/\/[^/]+/,''),(r.postData()||'').slice(0,600)); });
p.on('response',async r=>{ if(r.request().method()==='POST'&&/(sv11839api|api\.shopview\.com)/.test(r.url())) console.log('RES',r.status(),(await r.text()).slice(0,200)); });
const ids=async()=>p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')+(e.disabled?'(dis)':'')));
await s.go(`/parts/vendor/${vid}/unpaid-invoices`); await p.waitForTimeout(3500);
if(amt!=='0'){ await p.click('[data-test-id=button_new_credit_vendor]'); await p.waitForTimeout(1500); console.log('CREDIT IDS',(await ids()).join(' '));
 await p.fill('[data-test-id=input_credit_amount]',amt); await p.fill('[data-test-id=input_credit_memo]',memo); await p.screenshot({path:`../ev/credit-${memo}.png`});
 const sv=(await ids()).find(x=>/save|submit|create/i.test(x)); console.log('save btn',sv); await p.click(`[data-test-id=${sv.replace('(dis)','')}]`); await p.waitForTimeout(3000); }
await s.close(); process.exit(0);
await p.click('[data-test-id=button_new_payment]'); await p.waitForTimeout(2500); console.log('PAY IDS',(await ids()).join(' '));
const txt=await p.evaluate(()=>document.querySelector('.q-dialog')?.innerText||''); console.log('PAY TEXT',txt.replace(/\n+/g,' | ').slice(0,1500));
await p.screenshot({path:`../ev/newpay-${memo}.png`});
await s.close(); process.exit(0);
