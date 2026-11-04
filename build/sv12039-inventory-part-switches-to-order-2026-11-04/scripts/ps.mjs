// usage: [ENV=prod] COMPANY=<id> INV=<inventory part id> SEARCH=<text> QTY=<n> TAG=<tag> node ps.mjs  -> part sale: pick inventory part, click Amount, save
import {sess,post} from './common.mjs'; import fs from 'fs';
const {INV,SEARCH,QTY,COMPANY}=process.env; const OUT='ev/'+process.env.TAG; fs.mkdirSync(OUT,{recursive:true});
const s=await sess(); const p=s.page; await s.go('/workorders'); await p.waitForTimeout(3000); const R={marker:await s.marker(),steps:[]};
const c=await post(s,'/api/part-sales',{company_id:COMPANY}); const id=(c.json?.data||[])[0]?.id||c.json?.data?.id; R.partSale=id; console.log('part sale',c.status,id);
await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(7000);
const st=async(label,shot)=>{ const d=await p.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop()||document; const v=id=>{const e=d.querySelector(`[data-test-id="${id}"]`); if(!e) return undefined; const i=e.matches('input')?e:e.querySelector('input'); return i?i.value:e.innerText.replace(/\s+/g,' ').trim();}; const src=d.querySelector('[data-test-id="select_workorder_part_source"]');
  return {partNumber:v('select_part'),quantity:v('input_workorder_part_quantity'),source:src?src.innerText.replace(/\s+/g,' ').trim():undefined,bins:[...d.querySelectorAll('[data-test-id^="input_bin_quantity_"]')].length,inventoryTable:/Quantity in stock/i.test(d.innerText)};});
  R.steps.push({label,...d}); await p.screenshot({path:`${OUT}/${shot}.png`}); console.log(label,'=>',JSON.stringify(d)); };
await st('page open','1-open');
const sp=p.locator('[data-test-id="select_part"] input, input[data-test-id="select_part"]').first(); await sp.click(); await p.keyboard.insertText(SEARCH); await p.waitForTimeout(3500);
await p.click(`[data-test-id="select_option_workorder_part_${INV}-inventory_part"]`); await p.waitForTimeout(2500); await st('picked Inventory option','2-picked');
const bq=p.locator('[data-test-id^="input_bin_quantity_"] input, input[data-test-id^="input_bin_quantity_"]').first();
if(await bq.count()){ await bq.click(); await p.waitForTimeout(1500); await st('clicked into Amount','3-clicked-amount'); if(await bq.count()&&await bq.isVisible()){ await bq.fill(QTY); await p.waitForTimeout(1200); await st('typed Amount','4-typed'); } }
const sv=p.locator('[data-test-id="button_workorder_part_save"]'); if(await sv.count()){ await sv.click(); await p.waitForTimeout(4000); }
R.after=await p.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?'DIALOG STILL OPEN: '+d.innerText.replace(/\n+/g,' | ').slice(0,300):null;});
await s.go(`/parts/part-sale/${id}/part-requests`); await p.waitForTimeout(6000); await p.screenshot({path:`${OUT}/5-after-save.png`});
const L=(await s.api('/api/work-orders/lines/'+id)).json?.data; const lines=L?.collection||L?.lines||L||[];
R.requests=(Array.isArray(lines)?lines:[]).flatMap(l=>(l.part_requests||[]).map(r=>({pn:r.part_number,qty:r.quantity,status:r.status,source:r.part_source_type,on_hand:r.on_hand_quantity})));
console.log('after',R.after,JSON.stringify(R.requests)); fs.writeFileSync(OUT+'/result.json',JSON.stringify(R,null,1)); await s.close(); process.exit(0);
