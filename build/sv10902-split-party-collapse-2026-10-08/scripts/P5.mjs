import {op,j} from './lib.mjs'; import fs from 'fs';
const s=await op({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const R=JSON.parse(fs.readFileSync('prod-ids.json'));
for(const [n,short] of [['Acme','ZZ Acme'],['Bob','ZZ Bob'],['Carol','ZZ Carol']]){ const r=await s.api('/api/accounting/customers/'+R.P[n].id,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({name:short})}); console.log('rename',n,r.status,r.status>299?JSON.stringify(r.json).slice(0,200):''); }
await p.goto(s.host.app+'/accounting/banking/transactions',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(5000);
const card='card_account_accounting_bank_transactions_'+R.bank; const b=await s.box(card); await p.mouse.click(b.x,b.y); await p.waitForTimeout(3500);
await p.screenshot({path:'P5-list-after.png'});
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(tr=>tr.innerText.replace(/\s+/g,' ').trim()))));
const geo=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(tr=>{const d=tr.querySelector('[data-test-id*="_description"]'); const pa=tr.querySelector('[data-test-id*="_party"]'); const r=e=>{const q=e.getBoundingClientRect(); return [q.x,q.y,q.width,q.height].map(Math.round);}; return {desc:d?.innerText.trim(),row:r(tr),party:pa?r(pa):null};})); console.log(JSON.stringify(geo)); fs.writeFileSync('P5-geo.json',JSON.stringify(geo));
await s.close();
