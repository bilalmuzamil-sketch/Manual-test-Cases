// node recv.mjs <orderId> <invoiceNo> -> opens /accept-delivery/<id>, fills invoice number, receives; logs the accept call
import {sess} from './common.mjs'; const s=await sess({vp:{width:1700,height:1000}}); const p=s.page; const [oid,inv]=process.argv.slice(2);
p.on('request',r=>{ if(/orders\/accept|deliver/.test(r.url())&&r.method()==='POST') console.log('REQ',r.url().replace(/^https:\/\/[^/]+/,''),(r.postData()||'').slice(0,800)); });
p.on('response',async r=>{ if(/orders\/accept/.test(r.url())) console.log('RES',r.status(),(await r.text()).slice(0,300)); });
await s.go('/accept-delivery/'+oid); await p.waitForTimeout(4000);
const ids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')+(e.disabled?'(dis)':'')).filter(x=>!/nav|menu_link|mobile/.test(x))); console.log('IDS',ids.join(' ').slice(0,1500));
await p.screenshot({path:`../ev/recv-${inv}-a.png`});
const invI=p.locator('[data-test-id=input_invoice-number], [data-test-id=input_invoice_number], input[name=invoice-number]').first();
if(await invI.count()){ await invI.fill(inv); } else console.log('no invoice input');
await p.waitForTimeout(800); await p.screenshot({path:`../ev/recv-${inv}-b.png`});
await p.click('[data-test-id=button_receive_delivery]'); await p.waitForTimeout(2500);
const dlg=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].map(b=>b.innerText.trim()+'|'+(b.getAttribute('data-test-id')||''))); console.log('DLG',dlg.join(' ; '));
for(const t of ['Yes','Confirm','Receive','OK']){ const b=p.locator('.q-dialog button',{hasText:t}).first(); if(await b.count()){ await b.click(); await p.waitForTimeout(2500); console.log('clicked',t); break; } }
console.log('URL',p.url()); await p.screenshot({path:`../ev/recv-${inv}-c.png`});
const btn=await p.evaluate(()=>[...document.querySelectorAll('button')].map(b=>b.innerText.trim()+'|'+(b.getAttribute('data-test-id')||'')+(b.disabled?'|dis':'')).filter(x=>x.length>1)); 
await s.close(); process.exit(0);
