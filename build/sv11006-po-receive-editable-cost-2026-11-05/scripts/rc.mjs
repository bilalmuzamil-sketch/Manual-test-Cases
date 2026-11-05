// usage: node rc.mjs <tag> <cost1,cost2,..|-> [receive=1|0] [suffix] -> PO receive screen (via Parts > Purchase Orders row Receive when found); types costs; reads Cost/Sell cells; optionally receives; reads WO parts
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const [TAG,COSTS,RECV,SUF]=process.argv.slice(2); const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-${ENV}-${TAG}.json`,'utf8'));
const po=S.parts[0].order.orderId; const items=S.parts.map(x=>x.order.orderItemId); const costs=(COSTS&&COSTS!=='-')?COSTS.split(','):[];
const s=await sess(); const p=s.page; const OUT=`../ev/${ENV}-rc-${TAG}${SUF||''}`; fs.mkdirSync(OUT,{recursive:true}); const R={};
await s.go('/parts/orders'); await p.waitForTimeout(3000); const row=p.locator('tbody tr',{hasText:S.number}).first(); R.rowFound=await row.count();
if(R.rowFound) await row.locator('[data-test-id="button_receive"]').click(); else await s.go('/order/'+po+'?receive=1'); await p.waitForTimeout(4000); R.url=p.url().replace(/^https:\/\/[^/]+/,'');
const snap=async()=>p.evaluate(ids=>ids.map(id=>{ const tr=document.querySelector(`[data-test-id="icon_edit_part_number_${id}"]`)?.closest('tr'); const c=document.querySelector(`[data-test-id="input_cost_${id}"]`);
  const tds=tr?[...tr.querySelectorAll('td')].map(t=>t.innerText.trim().replace(/\s+/g,' ')):[]; return {id:id.slice(0,8),costInput:c?c.value:null,costEditable:!!c&&!c.readOnly&&!c.disabled,costText:tds[2],sell:tds[3],total:tds[6]}; }),items);
R.before=await snap(); await p.screenshot({path:OUT+'/1-before.png'});
for(let k=0;k<costs.length;k++){ if(!costs[k]) continue; const i=p.locator(`[data-test-id="input_cost_${items[k]}"]`); if(await i.count()){ await i.click(); await i.fill(''); await i.type(costs[k],{delay:50}); await p.waitForTimeout(700);} else R['noInput'+k]=true; }
R.typed=await snap(); await p.screenshot({path:OUT+'/2-typed.png'});
if(RECV!=='0'){ await p.locator(`[data-test-id="input_invoice_${po}"]`).fill('ZZ'+TAG+(SUF||'')); const n=s.writes.length; await p.locator(`[data-test-id="button_receive_po_${po}"]`).click(); await p.waitForTimeout(5000);
  R.sent=s.writes.slice(n).map(w=>w.slice(0,120)); R.toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(x=>x.innerText.replace(/\s+/g,' '))); await p.screenshot({path:OUT+'/3-after.png'});
  const v=(await s.api('/api/work-orders/lines/'+S.wo)).json; const parts=[]; JSON.stringify(v,(k,val)=>{ if(val&&val.part_request_id&&S.parts.some(x=>x.pr===val.part_request_id)) parts.push({pn:val.part_number,status:val.status_val,cost:val.cost,sell:val.sell_price,margin:val.margin}); return val; }); R.woParts=parts; }
console.log(JSON.stringify(R)); fs.writeFileSync(OUT+'/result.json',JSON.stringify(R,null,1)); await s.close(); process.exit(0);
