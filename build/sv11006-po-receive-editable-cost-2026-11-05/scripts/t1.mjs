// usage: node t1.mjs <tag> <costA> <costB> -> Parts > Purchase Orders > row Receive; edit costs; read Sell (and try typing into Sell); receive; read the WO parts
import {sess,post} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const TAG=process.argv[2]; const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-${ENV}-${TAG}.json`,'utf8')); const po=S.parts[0].order.orderId;
const [cA,cB]=[process.argv[3]||'80',process.argv[4]||'25']; const items=S.parts.map(x=>x.order.orderItemId);
const s=await sess(); const p=s.page; const OUT=`../ev/${ENV}-t1-${TAG}`; fs.mkdirSync(OUT,{recursive:true}); const R={};
await s.go('/parts/orders'); await p.waitForTimeout(3500);
const row=p.locator('tbody tr',{hasText:S.number}).first(); R.rowFound=await row.count(); R.rowText=R.rowFound?(await row.innerText()).replace(/\s+/g,' '):null;
if(R.rowFound){ await row.locator('[data-test-id="button_receive"]').click(); } else { await s.go('/order/'+po+'?receive=1'); }
await p.waitForTimeout(4000); R.url=p.url().replace(/^https:\/\/[^/]+/,'');
const cells=async()=>p.evaluate(ids=>ids.map(id=>{ const c=document.querySelector(`[data-test-id="input_cost_${id}"]`); const tr=c?.closest('tr')||document.querySelector(`[data-test-id="icon_edit_part_number_${id}"]`)?.closest('tr');
  const tds=tr?[...tr.querySelectorAll('td')].map(t=>t.innerText.trim()):[]; return {id:id.slice(0,8),cost:c?c.value:null,costRO:c?(c.readOnly||c.disabled):'no-input',tds,sellInputs:tr?[...tr.querySelectorAll('input')].map(i=>i.getAttribute('data-test-id')||i.closest('[data-test-id]')?.getAttribute('data-test-id')):[]}; }),items);
R.before=await cells(); await p.screenshot({path:OUT+'/1-before.png'});
for(const [id,v] of [[items[0],cA],[items[1],cB]]){ const i=p.locator(`[data-test-id="input_cost_${id}"]`); await i.click(); await i.fill(''); await i.type(v,{delay:60}); await p.waitForTimeout(800); }
R.afterType=await cells(); await p.screenshot({path:OUT+'/2-after-type.png'});
// try to type into the Sell cell of part A
const tr=p.locator(`[data-test-id="input_cost_${items[0]}"]`).locator('xpath=ancestor::tr'); const sellCell=tr.locator('td').nth(3); await sellCell.click(); await p.keyboard.type('999'); await p.waitForTimeout(500);
R.afterSellTry=await cells();
await p.locator(`[data-test-id="input_invoice_${po}"]`).fill('ZZ11006'+TAG); await p.waitForTimeout(600);
const btn=p.locator(`[data-test-id="button_receive_po_${po}"]`); R.btn=(await btn.innerText()).trim()+' disabled='+(await btn.isDisabled()); await p.screenshot({path:OUT+'/3-ready.png'});
await btn.click(); await p.waitForTimeout(5000); R.urlAfter=p.url().replace(/^https:\/\/[^/]+/,''); await p.screenshot({path:OUT+'/4-after-receive.png'});
R.writes=s.writes?.slice?.(-6);
const v=await s.api('/api/work-orders/lines/'+S.wo); fs.writeFileSync(OUT+'/lines.json',JSON.stringify(v.json,null,1));
const parts=[]; JSON.stringify(v.json,(k,val)=>{ if(val&&typeof val==='object'&&val.part_request_id&&S.parts.some(x=>x.pr===val.part_request_id)) parts.push({id:val.part_request_id.slice(0,8),pn:val.part_number,status:val.status_val||val.status,margin:val.margin,inv:val.delivery_invoice_number,cost:val.cost,sell:val.sell_price??val.sell,qty:val.quantity}); return val; });
R.woParts=parts; console.log(JSON.stringify(R,null,1)); fs.writeFileSync(OUT+'/result.json',JSON.stringify(R,null,1)); await s.close(); process.exit(0);
