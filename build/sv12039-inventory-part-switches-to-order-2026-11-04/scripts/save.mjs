// usage: [ENV=prod] WOJ=<wo json> PN=<pn> PID=<inventory part id> QTY=<n> TAG=<tag> [KIND=inventory_part|catalogue_part] [HOW=enter|button] node save.mjs
import {sess} from './common.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync(process.env.WOJ||'/tmp/sv12039/wo-explore.json','utf8')); const {PN,PID,QTY}=process.env; const KIND=process.env.KIND||'inventory_part'; const OUT='ev/'+process.env.TAG; fs.mkdirSync(OUT,{recursive:true});
const s=await sess(); const p=s.page; const R={marker:await s.marker(),pn:PN,qty:QTY,kind:KIND,wo:W.number,caps:[]};
p.on('response',async r=>{const u=r.url(); if(r.request().method()!=='GET'&&/\/api\//.test(u)&&!/sentry|log/.test(u)){let b='';try{b=(await r.text()).slice(0,500)}catch{} R.caps.push({m:r.request().method(),u:u.replace(/^https:\/\/[^/]+/,''),st:r.status(),req:(r.request().postData()||'').slice(0,700),res:b});}});
await s.go(`/workorders/${W.wo}/lines`); await p.waitForTimeout(6000);
const parts=()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id="table_work_order_lines"] tr, [data-test-id^="part_request_row"]')].map(t=>t.innerText.replace(/\s+/g,' ').trim()).filter(t=>t.length<400));
R.before=await parts();
await p.click('[data-test-id="button_add_part"]'); await p.waitForTimeout(1500);
await p.keyboard.type(PN,{delay:60}); await p.waitForTimeout(3500);
R.options=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\n+/g,' / ').slice(0,160)));
await p.click(`[data-test-id="select_option_workorder_part_${PID}-${KIND}"]`); await p.waitForTimeout(2000);
const qi=p.locator('[data-test-id="input_inline_part_quantity"] input, input[data-test-id="input_inline_part_quantity"]').first(); await qi.click(); await p.keyboard.press('Control+A'); await p.keyboard.type(QTY,{delay:80}); await p.waitForTimeout(1200);
await p.screenshot({path:OUT+'/1-row-filled.png'});
if((process.env.HOW||'button')==='enter') await p.keyboard.press('Enter'); else await p.click('[data-test-id="button_save_inline_part"]');
await p.waitForTimeout(4000); R.toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\n/g,' ')));
R.dialog=await p.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?d.innerText.replace(/\n+/g,' | ').slice(0,600):null;});
await p.screenshot({path:OUT+'/2-after-save.png'});
if(R.dialog){ await p.keyboard.press('Escape').catch(()=>{}); await p.waitForTimeout(800); }
await s.go(`/workorders/${W.wo}/lines`); await p.waitForTimeout(6000); R.after=await parts();
await p.screenshot({path:OUT+'/3-lines-after.png'});
const L=(await s.api('/api/work-orders/lines/'+W.wo)).json?.data; const lines=L?.collection||L?.lines||L||[];
R.requests=(Array.isArray(lines)?lines:[]).flatMap(l=>(l.part_requests||[]).map(r=>({pn:r.part_number,desc:(r.description||'').slice(0,50),qty:r.quantity,status:r.status,source:r.part_source_type||r.source_type||r.source,on_hand:r.on_hand_quantity,inv:r.inventory_part_id||r.part_id})));
fs.writeFileSync(OUT+'/result.json',JSON.stringify(R,null,1));
console.log(JSON.stringify({marker:R.marker.version,options:R.options,toasts:R.toasts,dialog:R.dialog,caps:R.caps.map(c=>c.m+' '+c.u+' '+c.st+' :: '+c.req.slice(0,400)),requests:R.requests},null,1).slice(0,5000));
await s.close(); process.exit(0);
