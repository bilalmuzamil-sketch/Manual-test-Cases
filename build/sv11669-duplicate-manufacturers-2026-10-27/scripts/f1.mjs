import {sess} from './lib.mjs'; import fs from 'fs';
const tag=process.argv[2]||'f1'; const s=await sess('admin',{vp:{width:1400,height:950},dpr:2}); const P=s.page;
await s.go('/parts/parts-catalogue'); await P.waitForTimeout(3000);
let b=await s.box('filter_chip_manufacturer'); await P.mouse.click(b.x,b.y); await P.waitForTimeout(1500);
const pop=await P.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].pop(); return {ids:[...m.querySelectorAll('[data-test-id]')].map(e=>e.dataset.testId).slice(0,12),items:[...m.querySelectorAll('.q-item, label, .q-checkbox')].map(e=>e.innerText.trim()).filter(Boolean)};});
console.log('menu ids',pop.ids.join(' | ')); console.log('item count',pop.items.length,'first',JSON.stringify(pop.items.slice(0,5)));
const all=pop.items.map(x=>x.replace(/\s+/g,' ').trim());
const cnt=n=>all.filter(x=>x.toLowerCase()===n).length; console.log('Accuride',cnt('accuride'),'Haldex',cnt('haldex'),'empty items',all.filter(x=>x==='').length, 'items total',all.length);
// search inside the filter if there is a search box
const inp=await P.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].pop(); const i=m.querySelector('input'); if(!i)return null; const r=i.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};});
if(inp){await P.mouse.click(inp.x,inp.y); await P.keyboard.type('accuride',{delay:60}); await P.waitForTimeout(1500);
  const vis=await P.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].pop(); return [...m.querySelectorAll('.q-item')].filter(e=>e.offsetParent).map(e=>{const r=e.getBoundingClientRect(); return {t:e.innerText.trim().replace(/\n/g,' '),x:r.x,y:r.y,w:r.width,h:r.height};});});
  console.log('search accuride ->',JSON.stringify(vis.map(v=>v.t))); fs.writeFileSync(`../ev/${tag}-filter-search.json`,JSON.stringify(vis));
  await P.screenshot({path:`../ev/${tag}-filter-search.png`});
  const it=vis.find(v=>/^.*Accuride$/.test(v.t)); if(it){await P.mouse.click(it.x+it.w/2,it.y+it.h/2); await P.waitForTimeout(800); await P.keyboard.press('Escape'); await P.waitForTimeout(2500);
   const rows=await P.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').trim()).filter(t=>/QA-11669/.test(t)));
   console.log('rows with filter',rows.length); rows.forEach(r=>console.log('  ',r.slice(0,110)));
   await P.screenshot({path:`../ev/${tag}-filtered-accuride.png`}); fs.writeFileSync(`../ev/${tag}-filtered.json`,JSON.stringify(rows));}}
await s.browser.close(); process.exit(0);
