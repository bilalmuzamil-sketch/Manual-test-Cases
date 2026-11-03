// production: New Line dialog labels/placeholders/focus/validation, canned pick, Edit Line on a new and an old line
import {prod,post,arr} from '../common.mjs'; import fs from 'fs'; const s=await prod('/tmp/qa71'); const p=s.page; const R={marker:await s.marker(),utc:new Date().toISOString()}; let n=0;
const shot=async t=>{n++; await p.screenshot({path:`sv10130/${String(n).padStart(2,'0')}-${t}.png`});};
const read=()=>p.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop(); if(!d) return null; const a=document.activeElement;
  return {fields:[...d.querySelectorAll('.q-field')].map(f=>({id:f.closest('[data-test-id]')?.getAttribute('data-test-id')||f.querySelector('[data-test-id]')?.getAttribute('data-test-id'),label:(f.querySelector('.q-field__label')?.innerText||'').trim(),ph:[...f.querySelectorAll('input,textarea')].map(i=>i.getAttribute('placeholder')),val:[...f.querySelectorAll('input,textarea')].map(i=>i.value).join('|'),
    phVisible:[...f.querySelectorAll('input,textarea')].some(i=>i.getAttribute('placeholder')&&!i.value&&getComputedStyle(i,'::placeholder').opacity!=='0')})).filter(f=>f.label||f.ph.some(Boolean)).slice(0,8),
   active:(a?.closest('[data-test-id]')?.getAttribute('data-test-id')||a?.tagName)+' ph='+(a?.getAttribute?.('placeholder')), msgs:[...d.querySelectorAll('.q-field__messages,.text-negative')].map(m=>m.innerText.trim()).filter(Boolean)};});
const C='bd77eaa6-963f-43fc-9a91-b950810ebf67'; const veh=arr((await s.api('/api/vehicles?company_id='+C)).json?.data)[0];
const WO=(await post(s,'/api/work-orders/create',{company_id:C,vehicle_id:veh.id,start_date:new Date().toISOString().slice(0,10),is_vehicle_here:true})).j.data.work_order_id; R.wo=WO;
const ct=await post(s,'/api/contacts/create',{company_id:C,first_name:'ZZAUTOTEST',last_name:'SV10130'}); await post(s,'/api/work-orders/change-contact',{work_order_id:WO,vehicle_id:veh.id,contact_id:ct.j?.data?.contact_id,update_vehicle:true});
for(const a of (((await s.api('/api/work-orders/view/'+WO)).json?.data?.work_order||{}).adjustments||[])) await post(s,'/api/work-orders/adjustments/remove',{adjustmentId:a.id,workOrderId:WO});
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(6000);
R.open=await read(); await shot('new-line-open'); console.log('OPEN',JSON.stringify(R.open));
await p.keyboard.type('ZZAUTOTEST SV-10130 title',{delay:30}); await p.waitForTimeout(800); R.typed=await read(); await shot('typed-title'); console.log('TYPED',JSON.stringify(R.typed));

// clear and try to save with empty Title
const t=p.locator('.q-dialog [data-test-id="select_line_canned_line"]').first(); if(await t.count()){ await t.click(); await p.keyboard.press('Control+A'); await p.keyboard.press('Backspace'); }
await p.click('[data-test-id="select_labour_type"]').catch(()=>{}); await p.waitForTimeout(700); await p.locator('.q-menu .q-item').first().click().catch(()=>{}); await p.waitForTimeout(500);
await p.click('[data-test-id="button_save_close"]'); await p.waitForTimeout(1500); R.emptySave=await read(); R.emptyToasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(x=>x.innerText.replace(/\s+/g,' '))); await shot('empty-title-save');
// pick a canned line
await t.click(); await p.waitForTimeout(1200); const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(i=>i.innerText.trim()).slice(0,5)); R.cannedOpts=opts;
await p.locator('.q-menu .q-item').first().click().catch(()=>{}); await p.waitForTimeout(1200); R.picked=await read(); await shot('canned-picked');
// save it with a description
const ds=p.locator('[data-test-id="input_line_description"] textarea, [data-test-id="input_line_description"] input').first(); if(await ds.count()){ await ds.click(); await ds.fill('ZZAUTOTEST SV-10130 description'); }
await p.click('[data-test-id="button_save_close"]'); await p.waitForTimeout(3000); R.afterSaveDlg=await read();
const lines=(await s.api(`/api/work-orders/lines/${WO}`)).json?.data; R.linesRaw=JSON.stringify(lines).slice(0,500);
fs.writeFileSync('sv10130/result.json',JSON.stringify(R,null,1)); console.log(JSON.stringify(R,null,1).slice(0,6000)); await s.close(); process.exit(0);
