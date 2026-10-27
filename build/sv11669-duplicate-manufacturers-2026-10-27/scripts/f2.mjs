import {sess} from './lib.mjs'; import fs from 'fs';
const ACC='808763a4-48f0-40f5-a2c0-5647a90996bd'; const s=await sess('admin',{vp:{width:1400,height:950},dpr:2}); const P=s.page;
await s.go('/parts/parts-catalogue'); await P.waitForTimeout(3000);
let b=await s.box('filter_chip_manufacturer'); await P.mouse.click(b.x,b.y); await P.waitForTimeout(1500);
await P.screenshot({path:'../ev/f2-filter-open.png'});
const st=await P.evaluate(()=>{const e=document.querySelector('[data-test-id="filter_select_all_manufacturer"]'); return e.innerText.replace(/\n/g,' ')+' aria='+(e.getAttribute('aria-checked')||e.querySelector('[aria-checked]')?.getAttribute('aria-checked'));}); console.log('select all',st);
// if all are selected, clear them first via the select-all control
if(/true/.test(st)){b=await s.box('filter_select_all_manufacturer'); await P.mouse.click(b.x,b.y); await P.waitForTimeout(800);}
await P.locator(`[data-test-id="filter_option_manufacturer_${ACC}"]`).scrollIntoViewIfNeeded(); await P.waitForTimeout(400);
const ob=await P.evaluate(id=>{const e=document.querySelector(`[data-test-id="filter_option_manufacturer_${id}"]`); const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,t:e.innerText.trim()};},ACC); console.log('option',JSON.stringify(ob));
await P.mouse.click(ob.x+ob.w/2,ob.y+ob.h/2); await P.waitForTimeout(800); await P.screenshot({path:'../ev/f2-filter-accuride-ticked.png'}); fs.writeFileSync('../ev/f2-option-box.json',JSON.stringify(ob));
await P.keyboard.press('Escape'); await P.waitForTimeout(2500);
console.log('chip',await P.evaluate(()=>document.querySelector('[data-test-id="filter_chip_manufacturer"]').innerText.replace(/\n/g,' ')));
const rows=await P.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>{const rr=r.getBoundingClientRect(); return {t:r.innerText.replace(/\s+/g,' ').trim(),x:rr.x,y:rr.y,w:rr.width,h:rr.height};}));
console.log('rows',rows.length); rows.forEach(r=>console.log('  ',r.t.slice(0,100)));
fs.writeFileSync('../ev/f2-rows.json',JSON.stringify(rows)); await P.screenshot({path:'../ev/f2-filtered-accuride.png'});
await s.browser.close(); process.exit(0);
