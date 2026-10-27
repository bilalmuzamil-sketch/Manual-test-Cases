// node fshot.mjs <tag> <text>
import {sess} from './lib.mjs'; import fs from 'fs';
const [tag,txt]=process.argv.slice(2); const s=await sess('admin',{vp:{width:1300,height:900},dpr:2}); const P=s.page;
await s.go('/parts/parts-catalogue'); await P.waitForTimeout(3000);
const b=await s.box('filter_chip_manufacturer'); await P.mouse.click(b.x,b.y); await P.waitForTimeout(1200);
const hasInput=await P.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].pop(); const i=m&&m.querySelector('input'); return i?{ph:i.placeholder,focused:document.activeElement===i}:null;}); console.log('menu input',JSON.stringify(hasInput));
if(txt){ await P.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].pop(); m.querySelector('input').focus();}); await P.keyboard.type(txt,{delay:60}); await P.waitForTimeout(1500); }
const items=await P.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].pop(); const r0=m.getBoundingClientRect(); return {menu:{x:r0.x,y:r0.y,w:r0.width,h:r0.height},items:[...m.querySelectorAll('[data-test-id^="filter_option_manufacturer_"],[data-test-id="filter_select_all_manufacturer"]')].map(e=>{const r=e.getBoundingClientRect(); return {t:e.innerText.trim(),raw:JSON.stringify(e.innerText),x:r.x,y:r.y,w:r.width,h:r.height};}).filter(i=>i.h>0)};});
console.log('menu still open',items.menu.h>0,'visible items',items.items.length,JSON.stringify(items.items.map(i=>i.raw)).slice(0,600));
fs.writeFileSync(`../ev/${tag}.json`,JSON.stringify(items)); await P.screenshot({path:`../ev/${tag}.png`}); await s.browser.close(); process.exit(0);
