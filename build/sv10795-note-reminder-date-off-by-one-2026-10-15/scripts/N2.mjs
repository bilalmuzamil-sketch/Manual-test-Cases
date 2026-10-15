import {ob,J,post} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('WO1.json')); const s=await ob({tz:'America/New_York'}); const p=s.page; await loc(s);
await s.go('/workorders/'+A.work_order_id+'/notes'); await p.waitForTimeout(4000);
await p.locator('[data-test-id="button_new_note"]').click(); await p.waitForTimeout(2500);
const d=await p.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog')].pop(); if(!d) return null; return {txt:d.innerText.replace(/\s+/g,' ').slice(0,600),tids:[...d.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')+'|'+e.tagName+'|'+(e.getAttribute('type')||'')+'|'+(e.value||e.innerText||'').trim().replace(/\s+/g,' ').slice(0,30))};});
console.log(J(d,3000)); await p.screenshot({path:'ev/N2-dialog.png'}); await s.close();
