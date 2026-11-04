// usage: [ENV=prod] WOJ=<wo json> INV=<inventory part id> SEARCH=<text pasted into Part Number> QTY=<n> TAG=<tag> [SAVE=1] node dlg.mjs
import {sess} from './common.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync(process.env.WOJ,'utf8')); const {INV,SEARCH,QTY}=process.env; const OUT='ev/'+process.env.TAG; fs.mkdirSync(OUT,{recursive:true});
const s=await sess(); const p=s.page; const R={marker:await s.marker(),search:SEARCH,inv:INV,qty:QTY,wo:W.number,steps:[],caps:[]};
p.on('response',async r=>{const u=r.url(); if(r.request().method()!=='GET'&&/part/.test(u)){let b='';try{b=(await r.text()).slice(0,400)}catch{} R.caps.push({m:r.request().method(),u:u.replace(/^https:\/\/[^/]+/,''),st:r.status(),req:(r.request().postData()||'').slice(0,800),res:b});}});
const t0=Date.now(); R.gets=[]; p.on('request',r=>{ if(r.method()==='GET'&&/\/api\//.test(r.url())) R.gets.push({t:Date.now()-t0,ev:'req',u:r.url().replace(/^https:\/\/[^/]+/,'').slice(0,200)}); }); p.on('response',r=>{ if(r.request().method()==='GET'&&/\/api\//.test(r.url())) R.gets.push({t:Date.now()-t0,ev:'res',st:r.status(),u:r.url().replace(/^https:\/\/[^/]+/,'').slice(0,200)}); });
const mark=l=>R.gets.push({t:Date.now()-t0,ev:'MARK',u:l});
const DELAY=+(process.env.DELAY||0); if(DELAY){ await p.route(new RegExp(process.env.DELAYRE||'search'), async route=>{ await new Promise(r=>setTimeout(r,DELAY)); await route.continue(); }); }
const st=async(label,shot)=>{ mark(label); const d=await p.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop(); if(!d) return null; const v=id=>{const e=d.querySelector(`[data-test-id="${id}"]`); if(!e) return undefined; const i=e.matches('input')?e:e.querySelector('input'); return i?i.value:e.innerText.replace(/\s+/g,' ').trim();};
   const bins=[...d.querySelectorAll('[data-test-id^="input_bin_quantity_"]')].map(e=>{const i=e.matches('input')?e:e.querySelector('input'); return e.getAttribute('data-test-id').replace('input_bin_quantity_','').slice(0,8)+'='+(i?i.value:'')});
   const src=d.querySelector('[data-test-id="select_workorder_part_source"]'); return {partNumber:v('select_part'),description:v('input_workorder_part_description'),quantity:v('input_workorder_part_quantity'),source:src?src.innerText.replace(/\s+/g,' ').trim():undefined,vendor:v('select_part_vendor'),cost:v('input_part_cost'),sell:v('input_workorder_part_sell_price'),inventoryTable:/Inventory\s*Bin name/i.test(d.innerText)||/Quantity in stock/i.test(d.innerText),bins};});
  R.steps.push({label,...d}); if(shot) await p.screenshot({path:`${OUT}/${shot}.png`}); console.log(label,'=>',JSON.stringify(d)); };
await s.go(`/workorders/${W.wo}/lines`); await p.waitForTimeout(6000);
await p.locator('[data-test-id="line_title"]').first().click({button:'right'}); await p.waitForTimeout(1000);
await p.click(`[data-test-id="menu-item_request_part_${W.line}"]`); await p.waitForTimeout(2500); await st('dialog open','1-dialog-open');
const sp=p.locator('.q-dialog [data-test-id="select_part"] input, .q-dialog input[data-test-id="select_part"]').first(); await sp.click(); await p.waitForTimeout(500);
await p.keyboard.insertText(SEARCH); await p.waitForTimeout(3500);
R.options=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\n+/g,' / ').slice(0,180)+' |'+(e.getAttribute('data-test-id')||'').slice(-60)));
console.log('options',JSON.stringify(R.options)); await p.screenshot({path:OUT+'/2-options.png'});
if(process.env.NEWPN){ await p.keyboard.press('Tab'); } else await p.click(`[data-test-id="select_option_workorder_part_${INV}-${process.env.KIND||'inventory_part'}"]`); await p.waitForTimeout(2500); await st('picked Inventory option','3-picked-inventory');
if(process.env.EDIT){ await sp.click(); await p.keyboard.press('End'); await p.keyboard.type(process.env.EDIT,{delay:60}); await p.waitForTimeout(800); await p.keyboard.press('Tab'); await p.waitForTimeout(1500); await st('edited part number text (+'+process.env.EDIT+') and left it','3d-edited'); }
R.focusAfterPick=await p.evaluate(()=>document.activeElement?.closest('[data-test-id]')?.getAttribute('data-test-id'));
const ACT=process.env.ACT||'none'; if(ACT==='tab'||ACT==='enter'){ await p.keyboard.press(ACT==='tab'?'Tab':'Enter'); await p.waitForTimeout(2000); await st('pressed '+ACT+' after picking','3b-after-'+ACT); R.focusAfterAct=await p.evaluate(()=>document.activeElement?.closest('[data-test-id]')?.getAttribute('data-test-id')); if(process.env.ACT2){ for(const k of process.env.ACT2.split(',')){ await p.keyboard.press(k); await p.waitForTimeout(1500); await st('pressed '+k,'3c-after-'+k);} } }
console.log('focus after pick',R.focusAfterPick,'after act',R.focusAfterAct);
const bq=p.locator('.q-dialog [data-test-id^="input_bin_quantity_"] input, .q-dialog input[data-test-id^="input_bin_quantity_"]').first();
if(await bq.count()){ await bq.click(); await p.waitForTimeout(1500); await st('clicked into Amount','4-clicked-amount');
  if(await bq.count()&&await bq.isVisible()){ await bq.fill(QTY); await p.waitForTimeout(1500); await st('typed Amount '+QTY,'5-typed-amount'); await p.keyboard.press('Tab'); await p.waitForTimeout(1500); await st('left Amount (Tab)','6-after-tab'); } }
else { console.log('NO BIN QUANTITY INPUT'); const tq=p.locator('.q-dialog [data-test-id="input_workorder_part_quantity"] input, .q-dialog input[data-test-id="input_workorder_part_quantity"]').first(); if(await tq.count()){ await tq.click(); await tq.fill(QTY); await p.waitForTimeout(1200); await st('typed Quantity '+QTY+' (top box)','5-typed-quantity'); } }
if(process.env.SAVE){ const b=p.locator('.q-dialog [data-test-id="button_workorder_part_save"]'); await b.click(); await p.waitForTimeout(4000);
  R.toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\n/g,' '))); R.dialogAfterSave=await p.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?d.innerText.replace(/\n+/g,' | ').slice(0,400):null;});
  await s.go(`/workorders/${W.wo}/lines`); await p.waitForTimeout(6000); await p.screenshot({path:OUT+'/7-lines-after-save.png'});
  const L=(await s.api('/api/work-orders/lines/'+W.wo)).json?.data; const lines=L?.collection||L?.lines||L||[];
  R.requests=(Array.isArray(lines)?lines:[]).flatMap(l=>(l.part_requests||[]).map(r=>({id:r.id,pn:r.part_number,qty:r.quantity,status:r.status,source:r.part_source_type,on_hand:r.on_hand_quantity}))); console.log('saved',JSON.stringify({toasts:R.toasts,dialogAfterSave:R.dialogAfterSave,caps:R.caps.map(c=>c.m+' '+c.u+' '+c.st+' :: '+c.req.slice(0,500)),requests:R.requests})); }
console.log('GETS',JSON.stringify(R.gets.filter(g=>g.ev==='MARK'||!/recent|notification|me\b|permissions|sentry/.test(g.u)).slice(-40)));
fs.writeFileSync(OUT+'/result.json',JSON.stringify(R,null,1)); await s.close(); process.exit(0);
