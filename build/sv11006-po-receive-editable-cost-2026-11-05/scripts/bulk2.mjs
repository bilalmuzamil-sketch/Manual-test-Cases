// usage: node bulk2.mjs <tagA> <tagB> <costA> -> on /bulk-receive?ids=... : Expand All, dump, edit cost of A's part A, tick POs, invoice #, Receive Selected; saved values
import {sess} from './common.mjs'; import fs from 'fs';
const [TA,TB,CA]=process.argv.slice(2); const SA=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-branch-${TA}.json`,'utf8')); const SB=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-branch-${TB}.json`,'utf8'));
const s=await sess(); const p=s.page; const OUT=`../ev/branch-bulk-${TA}`; fs.mkdirSync(OUT,{recursive:true}); const R={};
await s.go('/parts/orders'); await p.waitForTimeout(3500); for(const S of [SA,SB]){ await p.locator('tbody tr',{hasText:S.number}).first().locator('.q-checkbox, [role=checkbox]').first().click(); await p.waitForTimeout(400); } await p.locator('[data-test-id="button_receive_selected"]').click(); await p.waitForTimeout(5000); R.url=p.url().replace(/^https:\/\/[^/]+/,'');
await p.locator('[data-test-id^="button_toggle_expand_"]').first().click(); await p.waitForTimeout(2500);
const dump=async()=>p.evaluate(()=>({ids:[...document.querySelectorAll('[data-test-id]')].filter(b=>b.offsetParent&&/cost|sell|invoice|checkbox|receive/i.test(b.getAttribute('data-test-id'))).map(b=>b.getAttribute('data-test-id')+'='+(b.value??'')+'|'+b.innerText?.trim().slice(0,20)),
  text:(document.querySelector('main,.q-page')||document.body).innerText.replace(/\s+/g,' ').slice(0,1600)}));
R.expanded=await dump(); await p.screenshot({path:OUT+'/1-expanded.png',fullPage:true});
const id=SA.parts[0].order.orderItemId; const c=p.locator(`[data-test-id="input_cost_${id}"]`); R.hasCostA=await c.count();
if(R.hasCostA){ await c.click(); await c.fill(''); await c.type(CA,{delay:50}); await p.waitForTimeout(1200); }
R.typed=(await dump()).text; await p.screenshot({path:OUT+'/2-typed.png',fullPage:true});
for(const S of [SA,SB]){ const cb=p.locator(`[data-test-id="checkbox_po_${S.parts[0].order.orderId}"]`); if((await cb.getAttribute('aria-checked'))!=='true'){ await cb.click(); await p.waitForTimeout(500);} }
for(const inp of await p.locator('[data-test-id^="input_invoice"]').all()){ await inp.fill('ZZbk'+Math.floor(Math.random()*9000+1000)); }
R.ready=(await dump()); await p.screenshot({path:OUT+'/3-ready.png',fullPage:true});
const n=s.writes.length; await p.locator('[data-test-id="button_receive_all"]').click(); await p.waitForTimeout(6000);
R.sent=s.writes.slice(n).map(w=>w.slice(0,220)); R.toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(x=>x.innerText.replace(/\s+/g,' '))); await p.screenshot({path:OUT+'/4-after.png',fullPage:true});
for(const S of [SA,SB]){ const v=(await s.api('/api/work-orders/lines/'+S.wo)).json; const parts=[]; JSON.stringify(v,(k,val)=>{ if(val&&val.part_request_id&&S.parts.some(x=>x.pr===val.part_request_id)) parts.push({pn:val.part_number,cost:val.cost,sell:val.sell_price,margin:val.margin,inv:val.delivery_invoice_number}); return val; }); R['wo_'+S.number]=parts; }
console.log(JSON.stringify(R,null,1).slice(0,7000)); fs.writeFileSync(OUT+'/result2.json',JSON.stringify(R,null,1)); await s.close(); process.exit(0);
