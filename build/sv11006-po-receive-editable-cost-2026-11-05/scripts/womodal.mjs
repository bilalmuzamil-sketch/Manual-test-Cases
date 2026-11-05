// usage: node womodal.mjs <tag> <newCostA> -> WO Lines > line right-click > Receive parts (N) modal: change part A cost, tick all, invoice #, receive; read saved values
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const [TAG,CA]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-${ENV}-${TAG}.json`,'utf8'));
const s=await sess(); const p=s.page; const OUT=`../ev/${ENV}-womodal-${TAG}`; fs.mkdirSync(OUT,{recursive:true}); const R={};
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(3500);
await p.locator('[data-test-id="line_title"]').first().click({button:'right'}); await p.waitForTimeout(1000); await p.locator(`[data-test-id="menu-item_receive_parts_${S.line}"]`).click(); await p.waitForTimeout(3500);
const snap=async()=>p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id^="input_cost_"]')].map(i=>({id:i.getAttribute('data-test-id').slice(11,19),cost:i.value,ro:i.readOnly||i.disabled,row:i.closest('.row,tr,[class*=item]')?.innerText.replace(/\s+/g,' ').slice(0,140)})));
R.before=await snap(); R.headers=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.match(/Part number & description.{0,80}/s)?.[0].replace(/\s+/g,' '))); await p.screenshot({path:OUT+'/1-before.png'});
const a=p.locator(`.q-dialog [data-test-id="input_cost_${S.parts[0].order.orderItemId}"]`); const aa=(await a.count())?a:p.locator('.q-dialog [data-test-id^="input_cost_"]').first(); await aa.click(); await aa.fill(''); await aa.type(CA,{delay:50}); await p.waitForTimeout(700);
await p.locator('.q-dialog [data-test-id^="button_receive_select_all_"]').click(); await p.waitForTimeout(500);
await p.locator('.q-dialog [data-test-id^="input_invoice_number_"]').fill('ZZ'+TAG+'m'); R.typed=await snap(); await p.screenshot({path:OUT+'/2-typed.png'});
const n=s.writes.length; await p.locator('.q-dialog [data-test-id^="button_receive_vendor_"]').click(); await p.waitForTimeout(5000);
R.sent=s.writes.slice(n).map(w=>w.slice(0,200)); R.toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(x=>x.innerText.replace(/\s+/g,' '))); await p.screenshot({path:OUT+'/3-after.png'});
const v=(await s.api('/api/work-orders/lines/'+S.wo)).json; const parts=[]; JSON.stringify(v,(k,val)=>{ if(val&&val.part_request_id&&S.parts.some(x=>x.pr===val.part_request_id)) parts.push({pn:val.part_number,status:val.status_val,cost:val.cost,sell:val.sell_price,margin:val.margin}); return val; }); R.woParts=parts;
console.log(JSON.stringify(R,null,1)); fs.writeFileSync(OUT+'/result.json',JSON.stringify(R,null,1)); await s.close(); process.exit(0);
