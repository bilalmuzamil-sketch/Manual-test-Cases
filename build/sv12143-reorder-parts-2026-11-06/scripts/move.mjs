import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch'; const S=JSON.parse(fs.readFileSync(`/tmp/sv12143-${ENV}.json`,'utf8')); const s=await sess(); const p=s.page; const caps=[];
p.on('response',async r=>{ if(r.request().method()!=='GET'&&/\/api\/(?!6364962)/.test(r.url())){ let b='';try{b=(await r.text()).slice(0,200)}catch{} caps.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'')+' :: '+(r.request().postData()||'').slice(0,200)+' -> '+b);} });
await s.go('/workorders/'+S.id+'/lines'); await p.waitForTimeout(8000);
const row=p.locator('tr',{has:p.locator('[data-test-id^="part_number_"]',{hasText:process.env.NAME})}).first();
await row.locator('[data-test-id^="button_requested_part_context_menu_"]').first().click(); await p.waitForTimeout(1500); await p.click('[data-test-id="menu_item_move_requested_part"]'); await p.waitForTimeout(2500);
await p.click('[data-test-id="select_move_part_target_line"]'); await p.waitForTimeout(1500); const opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.replace(/\s+/g,' ').slice(0,80))); console.log('target opts',JSON.stringify(opts));
await p.locator('.q-menu .q-item').nth(Number(process.env.IDX||0)).click(); await p.waitForTimeout(1200); await p.screenshot({path:`../ev/${ENV}-move-dialog.png`}); const d0=await p.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?[...d.querySelectorAll('button')].map(b=>(b.getAttribute('data-test-id')||'')+':'+b.innerText.replace(/\s+/g,' ')+(b.disabled?'(off)':'')):null;}); console.log('buttons before',JSON.stringify(d0));
await p.click('[data-test-id="button_move_part_action"]'); await p.waitForTimeout(2500);
const d1=await p.evaluate(()=>{const d=document.querySelector('.q-dialog'); return d?{t:d.innerText.replace(/\n+/g,' | ').slice(0,300),b:[...d.querySelectorAll('button')].map(b=>(b.getAttribute('data-test-id')||'')+':'+b.innerText.replace(/\s+/g,' ')+(b.disabled?'(off)':''))}:null;}); console.log('after 1st',JSON.stringify(d1));
if(d1){ const c=p.locator('.q-dialog button').filter({hasText:/Are You Sure|Yes|Confirm|Move/i}).last(); if(await c.count()){ await c.click(); await p.waitForTimeout(3500); } }
console.log('toasts',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ')))));
console.log('caps',JSON.stringify(caps.filter(c=>!/recent-entities/.test(c))).slice(0,1200)); await s.close(); process.exit(0);
