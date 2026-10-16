import {start,J} from './drv.mjs'; import fs from 'fs';
const s=await start({vp:{width:1440,height:900}}); const p=s.page; const out={};
await s.go('/workorders?tab=all'); await p.waitForTimeout(4000);
out.marker=await s.marker();
const cards=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="board_card_"]')].filter(e=>/board_card_[0-9a-f]{8}-/.test(e.getAttribute('data-test-id'))).map(e=>{const r=e.getBoundingClientRect(); return {tid:e.getAttribute('data-test-id'),x:r.x,y:r.y,w:r.width,h:r.height,col:e.closest('[data-test-id^="board_column_"]')?.getAttribute('data-test-id')};}).filter(c=>c.y>0&&c.y+c.h<900));
out.visibleCards=cards.length;
const pick=[cards[0], cards.find(c=>c.col!==cards[0].col)].filter(Boolean);
const style=tid=>p.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`); const cs=getComputedStyle(e); return {boxShadow:cs.boxShadow,border:cs.borderTopColor+' '+cs.borderTopWidth,transform:cs.transform,transition:cs.transition,cls:e.className, rect:JSON.stringify(e.getBoundingClientRect())};},tid);
const ancestors=tid=>p.evaluate(t=>{let x=document.querySelector(`[data-test-id="${t}"]`).parentElement; const a=[]; while(x&&x!==document.body){const cs=getComputedStyle(x); if(cs.overflow!=='visible'||cs.overflowX!=='visible'||cs.overflowY!=='visible'||cs.clipPath!=='none'||cs.contain!=='none'){const r=x.getBoundingClientRect(); a.push({tag:x.tagName,cls:x.className.toString().slice(0,60),tid:x.getAttribute('data-test-id'),ov:cs.overflowX+'/'+cs.overflowY,contain:cs.contain,pad:cs.paddingLeft+' '+cs.paddingRight,rect:[r.x,r.y,r.width,r.height].map(Math.round)});} x=x.parentElement;} return a;},tid);
out.runs=[];
for(const c of pick){ await p.mouse.move(5,890); await p.waitForTimeout(600);
  const before=await style(c.tid); const clip={x:Math.max(0,c.x-24),y:Math.max(0,c.y-24),width:c.w+48,height:c.h+48};
  await p.screenshot({path:`ev/h-${c.tid.slice(11,19)}-before.png`,clip});
  await p.mouse.move(c.x+c.w/2,c.y+c.h/2,{steps:8}); await p.waitForTimeout(900);
  const after=await style(c.tid); await p.screenshot({path:`ev/h-${c.tid.slice(11,19)}-after.png`,clip});
  out.runs.push({card:c,before,after,clipAncestors:await ancestors(c.tid)}); }
// CSS rules that mention hover for the card's classes
out.hoverRules=await p.evaluate(()=>{const res=[]; for(const sh of document.styleSheets){ let rs; try{rs=sh.cssRules}catch(e){continue} for(const r of rs){ const t=r.cssText||''; if(/:hover/.test(t)&&/box-shadow/.test(t)&&/card/i.test(t)) res.push(t.slice(0,300)); } } return res.slice(0,15);});
fs.writeFileSync('ev/h2.json',JSON.stringify(out,null,1)); console.log(J(out,6000)); await s.close();
