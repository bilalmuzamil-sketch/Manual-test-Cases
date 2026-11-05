// usage: QUICK=tech node nosfd.mjs <tag> -> as the signed-in (no See Financial Data) user: Parts > Purchase Orders > row Receive; dump headers/inputs; receive
import {sess} from './common.mjs'; import fs from 'fs';
const TAG=process.argv[2]; const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-branch-${TAG}.json`,'utf8')); const po=S.parts[0].order.orderId;
const s=await sess({dir:'/tmp/qa94'}); const p=s.page; const OUT=`../ev/branch-nosfd-${TAG}`; fs.mkdirSync(OUT,{recursive:true}); const R={};
const fe=(await s.api('/api/auth/me/fe-permissions')).json?.data; R.sfd=fe?.cross_toggles; R.hasOrder=(fe?.fe_permissions||[]).filter(x=>/order|vendor/i.test(x));
await s.go('/parts/orders'); await p.waitForTimeout(3500); const row=p.locator('tbody tr',{hasText:S.number}).first(); R.rowFound=await row.count(); R.listHeaders=await p.evaluate(()=>[...document.querySelectorAll('thead th')].filter(x=>x.offsetParent).map(t=>t.innerText.trim()));
if(R.rowFound) await row.locator('[data-test-id="button_receive"]').click(); else await s.go('/order/'+po+'?receive=1'); await p.waitForTimeout(4000);
const d=await p.evaluate(()=>({url:location.pathname+location.search,headers:[...document.querySelectorAll('thead th')].filter(x=>x.offsetParent).map(t=>t.innerText.trim()),inputs:[...document.querySelectorAll('input')].filter(i=>i.offsetParent).map(i=>(i.getAttribute('data-test-id')||'?')+'='+i.value),rows:[...document.querySelectorAll('tbody tr')].filter(r=>r.offsetParent).map(r=>r.innerText.replace(/\s+/g,' ').slice(0,160))}));
R.receive=d; await p.screenshot({path:OUT+'/1-receive.png'});
await p.locator(`[data-test-id="input_invoice_${po}"]`).fill('ZZ'+TAG+'t'); const n=s.writes.length; await p.locator(`[data-test-id="button_receive_po_${po}"]`).click(); await p.waitForTimeout(5000);
R.sent=s.writes.slice(n).map(w=>w.slice(0,160)); R.toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(x=>x.innerText.replace(/\s+/g,' '))); await p.screenshot({path:OUT+'/2-after.png'});
console.log(JSON.stringify(R,null,1)); fs.writeFileSync(OUT+'/result.json',JSON.stringify(R,null,1)); await s.close(); process.exit(0);
