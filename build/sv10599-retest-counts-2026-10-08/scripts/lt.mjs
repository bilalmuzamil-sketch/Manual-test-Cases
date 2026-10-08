import {ob,j} from './lib.mjs'; import fs from 'fs';
const {wo}=JSON.parse(fs.readFileSync('wo-B.json'));
for(const w of [1900,390]){ const s=await ob({dpr:2,vp:{width:w,height:w>1000?1000:844}}); const p=s.page; await s.go(`/workorders/${wo}/lines`); await p.waitForTimeout(2500);
 const read=()=>p.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>e.childElementCount===0&&/\d+\s*(Part|Parts)?\s*In Stock|In Stock\s*\d/i.test(e.innerText||'')&&e.getBoundingClientRect().width>0).map(e=>e.innerText.trim()));
 console.log(w,'open',j(await read()));
 for(let i=0;i<4;i++){ const t=await p.evaluate(()=>{const e=[...document.querySelectorAll('button,i,.q-icon')].find(x=>/^(expand_less|keyboard_arrow_up)$/.test(x.innerText.trim())&&x.getBoundingClientRect().y>100&&!x.dataset.d);if(!e)return null;e.dataset.d=1;const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};}); if(!t)break; await p.mouse.click(t.x,t.y); await p.waitForTimeout(900);}
 console.log(w,'collapsed',j(await read())); await p.screenshot({path:`shots2/LT-${w}.png`,fullPage:true}); await s.close(); }
