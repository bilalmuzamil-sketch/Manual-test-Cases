import {sess} from './common.mjs'; import fs from 'fs';
const WO=process.env.WO, PN=process.env.PN||'SV-4162'; const s=await sess(); const p=s.page; const caps=[];
p.on('request',r=>{ if(/\/api\/work-orders\/part/.test(r.url())&&r.method()!=='GET') caps.push({u:r.url(),b:r.postData()}); });
p.on('response',async r=>{ if(/\/api\/work-orders\/part/.test(r.url())&&r.request().method()!=='GET') caps.push({status:r.status(),body:(await r.text().catch(()=>'')).slice(0,500)}); });
p.on('pageerror',e=>caps.push({pageerror:e.message.slice(0,200)}));
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(2500);
await s.glideClick('button_add_part'); await p.waitForTimeout(1500);
await s.glideClick(process.env.MORE==='1'?'button_more_options_inline_part':'select_inline_part_number'); await p.waitForTimeout(1500);
if(process.env.MORE==='1'){ await p.screenshot({path:'../ev/uicap4-more.png'});
  console.log('DIALOG',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')).join(' '))); await s.close(); process.exit(0);}
await p.keyboard.type(PN,{delay:60}); await p.waitForTimeout(3000);
const items=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,140)));
console.log('ITEMS',JSON.stringify(items.slice(0,6)));
const it=p.locator('.q-menu .q-item').first(); const bb=await it.boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(2500);
console.log('ROW',await p.evaluate(()=>[...document.querySelectorAll('[data-test-id="inline_part_row"] input')].map(e=>`${e.closest('[data-test-id]')?.getAttribute('data-test-id')}=${e.value}`).join(' ; ')));
console.log('VISIBLE',await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id')).filter(t=>/bin|inline|dialog/.test(t)).join(' ')));
await p.screenshot({path:'../ev/uicap4-row.png'});
if(process.env.SAVE==='1'){ await s.glideClick('input_inline_part_quantity'); await p.keyboard.type(process.env.QTY||'1'); await p.waitForTimeout(800);
  console.log('ROW2',await p.evaluate(()=>[...document.querySelectorAll('[data-test-id="inline_part_row"] input')].map(e=>`${e.closest('[data-test-id]')?.getAttribute('data-test-id')}=${e.value}`).join(' ; ')));
  await s.glideClick('button_save_inline_part'); await p.waitForTimeout(4000); await p.screenshot({path:'../ev/uicap4-saved.png'});
  console.log('AFTER',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id], .q-notification')].map(e=>e.getAttribute('data-test-id')||e.innerText.slice(0,100)).join(' '))); }
fs.writeFileSync('../ev/uicap4.json',JSON.stringify(caps,null,1)); console.log(JSON.stringify(caps,null,1).slice(0,2500));
await s.close();
