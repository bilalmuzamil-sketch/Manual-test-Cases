// list part rows on the line with their status + the menu items of each row's context menu
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'prod'; const S=JSON.parse(fs.readFileSync(`/tmp/sv12143-${ENV}.json`,'utf8')); const s=await sess(); const p=s.page;
await s.go('/workorders/'+S.id+'/lines'); await p.waitForTimeout(8000);
const rows=await p.evaluate(()=>[...document.querySelectorAll('tr')].filter(r=>r.querySelector('[data-test-id^="part_number_"]')).map(r=>({t:r.innerText.replace(/\s+/g,' ').slice(0,160),ids:[...r.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(x=>/menu|action|drag/.test(x))})));
console.log(JSON.stringify(rows,null,1));
for(const r of rows){ const m=r.ids.find(x=>/context_menu/.test(x)); if(!m) continue; await p.locator(`[data-test-id="${m}"]`).first().click(); await p.waitForTimeout(1500);
 console.log(r.t.slice(0,40),'=>',await p.evaluate(()=>{const d=document.querySelector('.q-menu'); return d?[...d.querySelectorAll('.q-item')].map(e=>e.innerText.trim()+'['+e.getAttribute('data-test-id')+']').join(' | '):'none'})); await p.keyboard.press('Escape'); await p.waitForTimeout(800); }
await s.close(); process.exit(0);
