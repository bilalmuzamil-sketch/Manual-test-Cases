// node psui.mjs <prefix>
import {ob,j} from './lib.mjs'; import fs from 'fs';
const pre=process.argv[2]; const s=await ob({dpr:2,vp:{width:1600,height:900}}); const p=s.page; const R={};
await s.go('/parts'); await p.waitForTimeout(1500);
const href=await p.evaluate(()=>[...document.querySelectorAll('a')].map(a=>[a.innerText.trim(),a.getAttribute('href')]).find(x=>/Part Sales/i.test(x[0])));
R.href=href; await s.go(href[1]); await p.waitForTimeout(2000);
const sb=await p.evaluate(()=>{const e=[...document.querySelectorAll('button,div,span,i')].find(x=>x.innerText&&/^(Search|search)$/.test(x.innerText.trim())&&x.getBoundingClientRect().width>0);if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};});
R.sb=sb; if(sb){ await p.mouse.click(sb.x,sb.y); await p.waitForTimeout(800); await p.keyboard.type('P10599-248',{delay:50}); await p.waitForTimeout(3500);}
R.row=await p.evaluate(n=>{const r=[...document.querySelectorAll('tr')].find(t=>t.innerText.includes(n));if(!r)return null;const g=r.getBoundingClientRect();const bub=[...r.querySelectorAll('*')].filter(e=>e.childElementCount===0&&/^\d+$/.test(e.innerText.trim())&&e.getBoundingClientRect().width<26&&e.getBoundingClientRect().width>0).map(e=>{const b=e.getBoundingClientRect();return {t:e.innerText.trim(),g:[b.x,b.y,b.width,b.height].map(Math.round)};});return {txt:r.innerText.replace(/\s+/g,' ').slice(0,200),g:[g.x,g.y,g.width,g.height].map(Math.round),bub};},'P10599-248');
await p.screenshot({path:`shots2/${pre}-pslist.png`});
if(R.row?.bub?.length){ const b=R.row.bub[0].g; await p.mouse.move(b[0]+b[2]/2,b[1]+b[3]/2); await p.waitForTimeout(1800);
 R.tip=await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>{const r=e.getBoundingClientRect();return {t:e.innerText.trim().replace(/\n+/g,' | '),g:[r.x,r.y,r.width,r.height].map(Math.round)};}));
 await p.screenshot({path:`shots2/${pre}-pslist-tip.png`}); }
fs.writeFileSync(`shots2/${pre}.json`,JSON.stringify(R,null,1)); console.log(j({href:R.href,row:R.row?.txt,bub:R.row?.bub?.map(x=>x.t),tip:R.tip?.map(x=>x.t)},900));
await s.close();
