// node invcredit.mjs -> new WO (contact, 1 canned line) -> complete -> invoice; Finance tab: invoice menu -> Issue Credit (STEP=discover prints dialog ids) -> then hover Reverse and read its tooltip. ENV=prod for production. ../ev/<env>-RC-*.png
import {sess,post} from './common.mjs'; import fs from 'fs';
const E=process.env.ENV==='prod'?'prod':process.env.ENV==='staging'?'staging':'branch'; const s=await sess({vp:{width:1600,height:900}}); const p=s.page; const arr=x=>Array.isArray(x)?x:(x?.collection||x?.items||[]); const R={};
await s.go('/workorders'); await p.waitForTimeout(1500);
const ws=arr((await s.api('/api/staff/my-workplaces')).json?.data); const W=E==='prod'?ws.find(w=>/Trucks Hill 2/.test(w.name)):ws.find(w=>w.id.startsWith('b3c8c820')); await post(s,'/api/iam/change-location',{workplace_id:W.id,workplace_timezone:W.timezone});
let wo=process.env.WO;
if(!wo){ const nm='ZZAUTOTEST SV12214 RC '+Date.now().toString().slice(-5);
 const co=(await post(s,'/api/customers/create',{name:nm})).json?.data; const company=co?.company_id||co?.id;
 const ct=(await post(s,'/api/contacts/create',{company_id:company,first_name:'ZZ',last_name:'RC12214',email:`zzrc12214${Date.now()%100000}@example.com`})).json?.data; const contact=ct?.contact_id||ct?.id;
 const vh=(await post(s,'/api/vehicles/create',{company_id:company,customer_id:contact,unit:'ZZRC'})).json?.data; const vehicle=vh?.vehicle_id||vh?.id;
 wo=(await post(s,'/api/work-orders/create',{company_id:company,customer_id:contact,vehicle_id:vehicle,workplace_id:W.id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true})).json?.data?.work_order_id;
 const all=arr((await s.api('/api/work-orders/canned-lines')).json?.data); const can=all.find(x=>Number(x.total_parts)===0&&Number(x.fixed_price||x.price||0)>0&&(!x.workplace_id||x.workplace_id===W.id))||all.find(x=>Number(x.total_parts)===0)||all[0];
 const ln=(await post(s,'/api/work-orders/'+wo+'/lines/create-from-canned-line',{canned_line_id:can.id,status:'authorized'})).json?.data?.line_id;
 console.log('mileage',(await post(s,'/api/work-orders/change-mileage',{work_order_id:wo,mileage:'123456'})).status);
 console.log('story',(await post(s,'/api/work-orders/lines/change-story',{line_id:ln,tech_story:'ZZ done',work_order_id:wo})).status);
 console.log('line complete',(await post(s,'/api/work-orders/lines/change-status',{line_id:ln,status:'complete'})).status);
 {const r=await post(s,'/api/work-orders/change-status',{id:wo,status:'complete'}); console.log('wo complete',r.status,JSON.stringify(r.json).slice(0,300));}
 const inv=await post(s,'/api/invoices/create',{work_order_id:wo}); console.log('invoice',inv.status,JSON.stringify(inv.json).slice(0,150)); }
R.wo=wo; const v=(await s.api('/api/work-orders/view/'+wo)).json?.data; R.number=(v?.work_order||v)?.display_number; console.log('WO',wo,R.number);
await s.go('/workorders/'+wo+'/finance'); await p.waitForTimeout(4000); await p.screenshot({path:`../ev/${E}-RC-1-finance.png`});
await p.click('[data-test-id=button_wo_invoice_menu]'); await p.waitForTimeout(900);
R.menu=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(i=>({t:i.innerText.replace(/\s+/g,' '),tid:i.getAttribute('data-test-id'),dis:i.getAttribute('aria-disabled')||i.className.includes('disabled')})));
console.log('menu',JSON.stringify(R.menu));
if(process.env.STEP!=='hover'){ await p.locator('.q-menu .q-item').filter({hasText:'Issue Credit'}).first().click(); await p.waitForTimeout(1800);
 R.dlg=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')+':'+e.tagName+':'+(e.innerText||e.value||'').replace(/\s+/g,' ').slice(0,30))); console.log('dialog',JSON.stringify(R.dlg)); await p.screenshot({path:`../ev/${E}-RC-2-issue-credit.png`});
 if(process.env.STEP==='discover'){ fs.writeFileSync(`../ev/${E}-RC.json`,JSON.stringify(R,null,1)); await s.close(); process.exit(0); }
 await p.click('[data-test-id=checkbox_credit_memo_type_parts]'); await p.waitForTimeout(900); const ids2=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id'))); console.log('after untick',ids2.join(' ')); const amtId=ids2.find(t=>/amount|labor|labour|total/.test(t)&&/input/.test(t)); if(amtId) await p.fill(`[data-test-id=${amtId}]`,'10'); console.log('amount field',amtId);
 await p.click('[data-test-id=radio_credit_memo_outcome_hold]'); await p.fill('[data-test-id=input_credit_memo_reason]','ZZ SV-12214 tooltip check');
 const d0=await p.inputValue('[data-test-id=date_input_credit_memo_date]'); await p.click('[data-test-id=date_icon_credit_memo_date]'); await p.waitForTimeout(1200);
 R.qdate=await p.evaluate(()=>[...document.querySelectorAll('.q-date')].map(m=>{const r=m.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),days:[...m.querySelectorAll('.q-date__calendar-item--in button')].filter(b=>!b.disabled).length}}));
 await p.screenshot({path:`../ev/${E}-RC-3a-date-picker.png`}); const dbtn=p.locator('.q-date .q-date__calendar-item--in button').nth(1); if(await dbtn.count()){ await dbtn.click(); await p.waitForTimeout(900); }
 R.dateBefore=d0; R.dateAfter=await p.inputValue('[data-test-id=date_input_credit_memo_date]'); console.log('qdate',JSON.stringify(R.qdate),'date',d0,'->',R.dateAfter);
 await p.waitForTimeout(400); console.log('qdate still open',await p.locator('.q-date').count());
 const save='button_confirm_dialog'; await p.screenshot({path:`../ev/${E}-RC-3-filled.png`});
 await p.click(`[data-test-id=${save}]`); await p.waitForTimeout(2500);
 const again=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].map(b=>b.innerText.replace(/\s+/g,' ')).filter(Boolean)); console.log('after save buttons',JSON.stringify(again)); const ays=p.locator('.q-dialog button').filter({hasText:/Are You Sure|Yes|Confirm|Issue/i}).last(); if(await p.locator('.q-dialog').count()&&await ays.count()){ await ays.click(); await p.waitForTimeout(2500); }
 await p.screenshot({path:`../ev/${E}-RC-4-after-credit.png`}); await s.go('/workorders/'+wo+'/finance'); await p.waitForTimeout(4000); await p.click('[data-test-id=button_wo_invoice_menu]'); await p.waitForTimeout(900);
 R.menu2=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(i=>({t:i.innerText.replace(/\s+/g,' '),tid:i.getAttribute('data-test-id'),dis:i.getAttribute('aria-disabled')||i.className.includes('disabled')}))); console.log('menu2',JSON.stringify(R.menu2)); }
const rev=p.locator('.q-menu .q-item').filter({hasText:'Reverse'}).first(); const b=await rev.boundingBox(); await p.mouse.move(b.x+b.width/2-20,b.y+b.height/2,{steps:4}); await p.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:4}); await p.waitForTimeout(1800);
R.tooltip=await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].filter(m=>m.getBoundingClientRect().width>0).map(m=>{const r=m.getBoundingClientRect();return {tid:m.getAttribute('data-test-id'),x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),text:m.innerText.replace(/\s+/g,' ')}}));
await p.screenshot({path:`../ev/${E}-RC-5-reverse-tooltip.png`}); console.log('tooltip',JSON.stringify(R.tooltip));
fs.writeFileSync(`../ev/${E}-RC.json`,JSON.stringify(R,null,1)); await s.close(); process.exit(0);
