import {sess} from './common.mjs'; import fs from 'fs';
const WO=process.env.WO, PN=process.env.PN||'SV-4162', SAVE=process.env.SAVE==='1'; const s=await sess(); const p=s.page; const caps=[];
p.on('request',r=>{ if(/part\/(make|change)-request/.test(r.url())) caps.push({u:r.url(),b:r.postData()}); });
p.on('response',async r=>{ if(/part\/(make|change)-request/.test(r.url())) caps.push({status:r.status(),body:(await r.text().catch(()=>'')).slice(0,400)}); });
p.on('pageerror',e=>caps.push({pageerror:e.message.slice(0,200)}));
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(2500);
await s.glideClick('button_add_part'); await p.waitForTimeout(2000);
const dump=async t=>console.log(t, await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')).join(' ')));
await dump('DIALOG');
const sp=p.locator('[data-test-id="select_part"] input, input[data-test-id="select_part"]').first();
await sp.click(); await p.keyboard.type(PN,{delay:60}); await p.waitForTimeout(3000);
const items=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,120)));
console.log('ITEMS',JSON.stringify(items.slice(0,5)));
const it=p.locator('.q-menu .q-item').first(); const bb=await it.boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(2500);
await dump('AFTER PICK');
console.log('INPUTS',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog input')].map(e=>`${e.getAttribute('data-test-id')||e.closest('[data-test-id]')?.getAttribute('data-test-id')}=${e.value}|${e.getAttribute('aria-label')}`).join(' ; ')));
console.log('BUTTONS',await p.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].map(e=>`${e.innerText.trim()}|${e.getAttribute('data-test-id')}|dis=${e.disabled}`).join(' ; ')));
await p.screenshot({path:'../ev/uicap2-dialog.png'});
if(SAVE){ const q=await p.$('[data-test-id^="input_bin_quantity_"]'); if(q){ await q.click({clickCount:3}); await p.keyboard.type(process.env.QTY||'1'); }
  const btn=p.locator('.q-dialog button').filter({hasText:/save & close/i}).first(); const b2=await btn.boundingBox(); await p.mouse.click(b2.x+b2.width/2,b2.y+b2.height/2); await p.waitForTimeout(4000);
  await p.screenshot({path:'../ev/uicap2-after-save.png'}); }
fs.writeFileSync('../ev/uicap2.json',JSON.stringify(caps,null,1)); console.log(JSON.stringify(caps,null,1).slice(0,3000));
await s.close();
