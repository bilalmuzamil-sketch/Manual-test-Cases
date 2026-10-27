// node fshot2.mjs <tag> <targets comma list, use _ for blank>
import {sess} from './lib.mjs'; import fs from 'fs';
const [tag,tl]=process.argv.slice(2); const targets=tl.split(',').map(x=>x==='_'?'':x.toLowerCase());
const s=await sess('admin',{vp:{width:1300,height:+(process.env.VH||900)},dpr:2}); const P=s.page;
await s.go('/parts/parts-catalogue'); await P.waitForTimeout(3000);
const b=await s.box('filter_chip_manufacturer'); await P.mouse.click(b.x,b.y); await P.waitForTimeout(1200);
const all=await P.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].pop(); return [...m.querySelectorAll('[data-test-id^="filter_option_manufacturer_"]')].map(e=>e.innerText);});
const norm=x=>x.trim().toLowerCase().replace(/\s+/g,' '); const counts={}; all.forEach(x=>counts[norm(x)]=(counts[norm(x)]||0)+1);
console.log('list total',all.length,'counts',JSON.stringify(targets.map(t=>[t||'(blank)',counts[t]||0])));
// scroll the first target into the middle of the menu
await P.evaluate(t0=>{const m=[...document.querySelectorAll('.q-menu')].pop(); const e=[...m.querySelectorAll('[data-test-id^="filter_option_manufacturer_"]')].find(x=>x.innerText.trim().toLowerCase().replace(/\s+/g,' ')===t0); e&&e.scrollIntoView({block:'center'});},targets[0]); await P.waitForTimeout(600);
const vis=await P.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu')].pop(); const mr=m.getBoundingClientRect(); return {menu:{x:mr.x,y:mr.y,w:mr.width,h:mr.height},items:[...m.querySelectorAll('[data-test-id^="filter_option_manufacturer_"]')].map(e=>{const r=e.getBoundingClientRect(); return {t:e.innerText,x:r.x,y:r.y,w:r.width,h:r.height};}).filter(i=>i.h>0)};});
vis.hits=vis.items.filter(i=>targets.includes(norm(i.t))); vis.counts=counts; vis.total=all.length;
console.log('visible',vis.items.length,'hits',JSON.stringify(vis.hits.map(h=>JSON.stringify(h.t))));
fs.writeFileSync(`../ev/${tag}.json`,JSON.stringify(vis)); await P.screenshot({path:`../ev/${tag}.png`}); await s.browser.close(); process.exit(0);
