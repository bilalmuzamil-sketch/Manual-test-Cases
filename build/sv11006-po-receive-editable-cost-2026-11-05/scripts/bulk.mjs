// usage: node bulk.mjs <tagA> <tagB> [costA] -> Parts > Purchase Orders: tick both rows > Receive Selected > bulk receive screen: dump; edit first WO part cost; read Sell; receive; read saved
import {sess} from './common.mjs'; import fs from 'fs';
const [TA,TB,CA]=process.argv.slice(2); const SA=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-branch-${TA}.json`,'utf8')); const SB=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-branch-${TB}.json`,'utf8'));
const s=await sess(); const p=s.page; const OUT=`../ev/branch-bulk-${TA}`; fs.mkdirSync(OUT,{recursive:true}); const R={};
await s.go('/parts/orders'); await p.waitForTimeout(3500);
for(const S of [SA,SB]){ const row=p.locator('tbody tr',{hasText:S.number}).first(); await row.locator('.q-checkbox, [role=checkbox]').first().click(); await p.waitForTimeout(400); }
R.btns=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(b=>b.offsetParent&&/receive|bulk|selected/i.test(b.getAttribute('data-test-id')+b.innerText)&&!/^button_receive$/.test(b.getAttribute('data-test-id'))).map(b=>b.getAttribute('data-test-id')+'='+b.innerText.trim().slice(0,30)));
await p.screenshot({path:OUT+'/0-list.png'});
const rs=p.getByRole('button',{name:/Receive Selected/i}).first(); if(await rs.count()){ await rs.click(); } await p.waitForTimeout(4500); R.url=p.url().replace(/^https:\/\/[^/]+/,'');
const dump=async()=>p.evaluate(()=>({headers:[...document.querySelectorAll('thead th')].filter(x=>x.offsetParent).map(t=>t.innerText.trim()),costs:[...document.querySelectorAll('[data-test-id^="input_cost_"]')].map(i=>i.getAttribute('data-test-id').slice(11,19)+'='+i.value),rows:[...document.querySelectorAll('tbody tr')].filter(r=>r.offsetParent).map(r=>r.innerText.replace(/\s+/g,' ').slice(0,140))}));
R.before=await dump(); await p.screenshot({path:OUT+'/1-bulk.png',fullPage:true});
const id=SA.parts[0].order.orderItemId; const c=p.locator(`[data-test-id="input_cost_${id}"]`); R.hasCostA=await c.count();
if(R.hasCostA){ await c.click(); await c.fill(''); await c.type(CA||'80',{delay:50}); await p.waitForTimeout(800); }
R.typed=await dump(); await p.screenshot({path:OUT+'/2-typed.png',fullPage:true});
for(const inp of await p.locator('[data-test-id^="input_invoice_"]').all()){ await inp.fill('ZZ'+TA+'bk'+Math.floor(Math.random()*90+10)); }
const btns=await p.locator('[data-test-id^="button_receive_po_"], [data-test-id^="button_receive_all"], [data-test-id^="button_receive_vendor_"]').all(); R.recvButtons=[]; for(const b of btns) R.recvButtons.push(await b.getAttribute('data-test-id')+'='+(await b.innerText()).trim());
console.log(JSON.stringify(R,null,1)); fs.writeFileSync(OUT+'/result.json',JSON.stringify(R,null,1)); await s.close(); process.exit(0);
