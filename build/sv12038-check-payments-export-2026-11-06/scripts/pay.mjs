import {sess} from './common.mjs'; const s=await sess(); const p=s.page; const CID=process.env.CID, REF=process.env.REF||'ZZ12038-1', PM=process.env.PM||'Check', N=+(process.env.N||2);
let full=null,resp=null; p.on('request',r=>{ if(/create-customer-payment/.test(r.url())) full=r.postData(); }); p.on('response',async r=>{ if(/create-customer-payment/.test(r.url())) resp=r.status()+' '+(await r.text()).slice(0,300); });
await s.go('/customers/'+CID+'/invoices'); await p.waitForTimeout(5000);
const rows=await p.evaluate(()=>[...document.querySelectorAll('tr')].map(tr=>{const cb=tr.querySelector('[data-test-id^="checkbox_transaction_"]'); return cb?{id:cb.getAttribute('data-test-id'),t:tr.innerText.replace(/\s+/g,' ').trim().slice(0,160)}:null}).filter(Boolean));
console.log(JSON.stringify(rows,null,0));
if(process.env.GO){ const inv=rows.filter(r=>/S2-|INV|S-\d/.test(r.t)&&!/credit/i.test(r.t)).slice(0,N);
  for(const r of inv){ await p.click(`[data-test-id="${r.id}"]`); await p.waitForTimeout(500); }
  await p.screenshot({path:'../ev/'+process.env.ENV+'-pay-ticked.png'});
  await p.click('[data-test-id="button_new_payment"]'); await p.waitForTimeout(2500);
  await p.click('[data-test-id="select_payment_method"]'); await p.waitForTimeout(1000);
  const items=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/check\s*$/,'').trim()));
  console.log('methods',JSON.stringify(items)); await p.locator('.q-menu .q-item').nth(items.findIndex(t=>t===PM)).click(); await p.waitForTimeout(600);
  const rf=p.locator('[data-test-id="input_reference_number"]'); if(await rf.count()) await rf.fill(REF);
  await p.screenshot({path:'../ev/'+process.env.ENV+'-pay-dialog.png'});
  await p.click('[data-test-id="button_make_payment"]'); await p.waitForTimeout(4000);
  console.log('payload',full); console.log('resp',resp); await p.screenshot({path:'../ev/'+process.env.ENV+'-pay-after.png'}); }
await s.close(); process.exit(0);
