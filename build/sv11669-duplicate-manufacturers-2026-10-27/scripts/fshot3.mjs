// node fshot3.mjs <tag> <targets,comma,_=blank> <anchor1|anchor2|...>
import {sess} from './lib.mjs'; import fs from 'fs';
const [tag,tl,al]=process.argv.slice(2); const targets=tl.split(',').map(x=>x==='_'?'':x.toLowerCase()); const anchors=al.split('|').map(x=>x==='_'?'':x.toLowerCase());
const norm=x=>x.trim().toLowerCase().replace(/\s+/g,' ');
const s=await sess('admin',{vp:{width:1300,height:900},dpr:2}); const P=s.page;
await s.go('/parts/parts-catalogue'); await P.waitForTimeout(3000);
let b=await s.box('filter_chip_manufacturer'); await P.mouse.click(b.x,b.y); await P.waitForTimeout(1200);
const allTxt=await P.evaluate(()=>document.querySelector('[data-test-id="filter_select_all_manufacturer"]').innerText);
if(/selected/.test(allTxt)){ b=await s.box('filter_select_all_manufacturer'); await P.mouse.click(b.x,b.y); await P.waitForTimeout(1200); console.log('reset to all:',await P.evaluate(()=>document.querySelector('[data-test-id="filter_select_all_manufacturer"]').innerText.replace(/\n/g,' '))); }
const out=[];
for(const [i,a] of anchors.entries()){
  const v=await P.evaluate(t0=>{const m=[...document.querySelectorAll('.q-menu')].pop(); const opts=[...m.querySelectorAll('[data-test-id^="filter_option_manufacturer_"]')];
    const nm=x=>x.trim().toLowerCase().replace(/\s+/g,' '); const last=t0.endsWith('#last'); const k=t0.replace('#last',''); const es=opts.filter(x=>nm(x.innerText)===k); const e=last?es[es.length-1]:es[0];
    let sc=e.parentElement; while(sc&&!(sc.scrollHeight>sc.clientHeight+5&&/(auto|scroll)/.test(getComputedStyle(sc).overflowY))) sc=sc.parentElement; sc=sc||m;
    const sr0=sc.getBoundingClientRect(), er0=e.getBoundingClientRect(); sc.scrollTop+= (er0.y-sr0.y)-(sc.clientHeight/2)+er0.height/2;
    const sr=sc.getBoundingClientRect(); window.scrollTo(0,0);
    return {menu:{x:sr.x,y:sr.y,w:sr.width,h:sc.clientHeight},items:opts.map(o=>{const r=o.getBoundingClientRect(); return {t:o.innerText,x:r.x,y:r.y,w:r.width,h:r.height};}).filter(x=>x.h>0&&x.y>=sr.y-1&&x.y+x.h<=sr.y+sc.clientHeight+1)};},a); await P.waitForTimeout(500);
  v.hits=v.items.filter(x=>targets.includes(norm(x.t))); v.file=`../ev/${tag}-${i}.png`; await P.screenshot({path:v.file}); out.push(v);
  console.log(i,a||'(blank)','visible',v.items.length,'hits',JSON.stringify(v.hits.map(h=>h.t)));}
fs.writeFileSync(`../ev/${tag}.json`,JSON.stringify(out)); await P.keyboard.press('Escape'); await P.waitForTimeout(1500);
console.log('chip after',await P.evaluate(()=>document.querySelector('[data-test-id="filter_chip_manufacturer"]').innerText.replace(/\n/g,' ')));
await s.browser.close(); process.exit(0);
