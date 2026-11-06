// node view.mjs <vendorId> <tag> -> Unpaid rows + Payments tab rows (text + rects json + screenshots), saves each payment's remittance PDF to ../ev/<tag>-remit-N.pdf
import {sess} from './common.mjs'; import fs from 'fs'; const s=await sess({vp:{width:1600,height:1000}}); const p=s.page; const [vid,tag]=process.argv.slice(2);
const pdfs=[]; p.on('response',async r=>{ const ct=r.headers()['content-type']||''; if(/pdf/.test(ct)){ try{ const b=await r.body(); const f=`../ev/${tag}-remit-${pdfs.length+1}.pdf`; fs.writeFileSync(f,b); pdfs.push(f); console.log('PDF',r.url().replace(/^https:\/\/[^/]+/,''),f,b.length);}catch(e){console.log('pdf err',e.message)} } });
await s.go(`/parts/vendor/${vid}/unpaid-invoices`); await p.waitForTimeout(3500);
console.log('UNPAID',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id=table-unpaid-transactions] tbody tr')].map(tr=>tr.innerText.replace(/\s+/g,' ').trim()).filter(Boolean))));
await p.screenshot({path:`../ev/${tag}-unpaid.png`});
await s.go(`/parts/vendor/${vid}/payments`); await p.waitForTimeout(3500);
// expand any collapsed payment rows
const exp=p.locator('[data-test-id=table_transactions_payment] button:has-text("expand_more"), [data-test-id=table_transactions_payment] .q-icon:text("keyboard_arrow_down")'); 
for(const b of await p.locator('[data-test-id^=button_toggle_payment_expansion_]').all()){ await b.click(); await p.waitForTimeout(1200); }
console.log('PAYROWS',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id=table_transactions_payment] tr')].map(tr=>tr.innerText.replace(/\s+/g,' ').trim()).filter(Boolean))));
console.log('PAYIDS',(await p.evaluate(()=>[...new Set([...document.querySelectorAll('[data-test-id=table_transactions_payment] [data-test-id]')].map(e=>e.getAttribute('data-test-id')))])).join(' '));
await p.screenshot({path:`../ev/${tag}-payments.png`,fullPage:true});
const rects=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id=table_transactions_payment] tr')].map(tr=>{const r=tr.getBoundingClientRect(); return {t:tr.innerText.replace(/\s+/g,' ').trim(),x:r.x,y:r.y+window.scrollY,w:r.width,h:r.height};}).filter(o=>o.t)); fs.writeFileSync(`../ev/${tag}-payments-rects.json`,JSON.stringify(rects));
p.context().on('page',async np=>{ console.log('POPUP',np.url()); });
for(const b of await p.locator('[data-test-id^=button_download_remittance_]').all()){ const dl=p.waitForEvent('download',{timeout:15000}).catch(()=>null); await b.click(); const d=await dl; if(d){ const f=`../ev/${tag}-remit-dl-${pdfs.length+1}.pdf`; await d.saveAs(f); pdfs.push(f); console.log('DL',f);} await p.waitForTimeout(2500); }
await s.close(); process.exit(0);
