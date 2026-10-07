// node rows.mjs <label> <pre> [admin|tech] [width]
import {ob,j} from './lib.mjs'; import fs from 'fs';
const [label,pre,who,w]=process.argv.slice(2); const {wo}=JSON.parse(fs.readFileSync(`wo-${label}.json`));
const vp=w?{width:Number(w),height:900}:{width:1900,height:1100};
const s=await ob({dpr:2,quick:who||'admin',vp}); const p=s.page; await s.go(`/workorders/${wo}/lines`); await p.waitForTimeout(2000);
if(w){ const c=await p.evaluate(()=>{const e=[...document.querySelectorAll('button,i')].find(x=>/expand_more|keyboard_arrow_down/.test(x.innerText)&&x.getBoundingClientRect().y>350);if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};}); if(c){await p.mouse.click(c.x,c.y); await p.waitForTimeout(1500);} }
const rows=await p.evaluate(()=>{const out=[];const re=/^(573\.D430FH-HV|MH55205|448-4865|577\.55547|ZZAUTOTEST vendor part)$/;
 [...document.querySelectorAll('*')].filter(e=>e.children.length<40&&re.test(e.innerText||'')).forEach(e=>{});
 const leaves=[...document.querySelectorAll('*')].filter(e=>e.childElementCount===0&&re.test(e.innerText||''));
 for(const l of leaves){let e=l;for(let i=0;i<8;i++){if(e.parentElement&&e.parentElement.innerText.length<250)e=e.parentElement;else break;}
   const chips=[...e.querySelectorAll('.q-badge,.q-chip')].map(c=>{const g=c.getBoundingClientRect();return {t:c.innerText.trim(),g:[g.x,g.y,g.width,g.height].map(Math.round)};});
   const g=e.getBoundingClientRect(); out.push({part:l.innerText.trim().slice(0,40),chips,btns:[...e.querySelectorAll('button')].map(b=>b.innerText.trim()).filter(Boolean),g:[g.x,g.y,g.width,g.height].map(Math.round)});}
 return out;});
console.log(who||'admin',w||'1900',j(rows,1500)); fs.writeFileSync(`shots/${pre}.json`,JSON.stringify(rows)); await p.screenshot({path:`shots/${pre}.png`,fullPage:!!w});
const me=(await s.api('/api/auth/me/fe-permissions')).json?.data; console.log('view_mode',me?.view_mode);
await s.close();
