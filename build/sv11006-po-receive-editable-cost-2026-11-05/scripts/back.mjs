// usage: node back.mjs <tag> -> PO receive: change cost, press Back (arrow) -> prompt? ; stay; restore original; Back -> prompt?
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const TAG=process.argv[2]; const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-${ENV}-${TAG}.json`,'utf8'));
const it=S.parts[0].order.orderItemId; const s=await sess(); const p=s.page; const OUT=`../ev/${ENV}-back-${TAG}`; fs.mkdirSync(OUT,{recursive:true}); const R={};
await s.go('/parts/orders'); await p.waitForTimeout(3000); await p.locator('tbody tr',{hasText:S.number}).first().locator('[data-test-id="button_receive"]').click(); await p.waitForTimeout(4000);
const dlg=async()=>p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>({text:d.innerText.replace(/\s+/g,' ').slice(0,300),buttons:[...d.querySelectorAll('button')].map(b=>(b.getAttribute('data-test-id')||'')+'='+b.innerText.trim())})));
const c=p.locator(`[data-test-id="input_cost_${it}"]`); R.orig=await c.inputValue(); await c.click(); await c.fill(''); await c.type('55',{delay:50}); await p.waitForTimeout(600);
await p.locator('[data-test-id="button_back_to_purchase_orders"]').click(); await p.waitForTimeout(1500); R.urlAfterBack1=p.url().replace(/^https:\/\/[^/]+/,''); R.dialog1=await dlg(); await p.screenshot({path:OUT+'/1-prompt.png'});
// stay on the page: press the dialog's non-discard button
const stay=p.locator('.q-dialog button').filter({hasText:/cancel|keep|stay|no/i}).first(); R.stayBtn=(await stay.count())?(await stay.innerText()).trim():null; if(R.stayBtn){ await stay.click(); await p.waitForTimeout(1200); }
R.urlAfterStay=p.url().replace(/^https:\/\/[^/]+/,''); R.costAfterStay=await c.inputValue().catch(()=>null);
await c.click(); await c.fill(''); await c.type(R.orig,{delay:50}); await p.waitForTimeout(600); await p.screenshot({path:OUT+'/2-restored.png'});
await p.locator('[data-test-id="button_back_to_purchase_orders"]').click(); await p.waitForTimeout(2500); R.urlAfterBack2=p.url().replace(/^https:\/\/[^/]+/,''); R.dialog2=await dlg(); await p.screenshot({path:OUT+'/3-back2.png'});
console.log(JSON.stringify(R,null,1)); fs.writeFileSync(OUT+'/result.json',JSON.stringify(R,null,1)); await s.close(); process.exit(0);
