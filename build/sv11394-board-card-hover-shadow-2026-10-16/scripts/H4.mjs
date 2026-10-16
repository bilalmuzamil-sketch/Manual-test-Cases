import {start,J} from './drv.mjs'; import fs from 'fs';
const out={};
for(const W of [1440,1920]){
  const s=await start({vp:{width:W,height:900}}); const p=s.page; await s.go('/workorders?tab=all'); await p.waitForTimeout(4500);
  const cards=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="board_card_"]')].filter(e=>/board_card_[0-9a-f]{8}-/.test(e.getAttribute('data-test-id'))).map(e=>{const r=e.getBoundingClientRect(); return {tid:e.getAttribute('data-test-id'),x:r.x,y:r.y,w:r.width,h:r.height,col:e.closest('[data-test-id^="board_column_"]')?.getAttribute('data-test-id'),noShadow:e.classList.contains('no-shadow')};}).filter(c=>c.y>150&&c.y+c.h<895&&c.x>0&&c.x+c.w<innerWidth));
  const res=[]; for(const c of cards){ await p.mouse.move(c.x+c.w/2,c.y+c.h/2,{steps:3}); await p.waitForTimeout(350);
    res.push(await p.evaluate(t=>{const e=document.querySelector(`[data-test-id="${t}"]`); return [getComputedStyle(e).boxShadow,getComputedStyle(e).borderTopColor, e.matches(':hover')];},c.tid)); }
  out[W]={cards:cards.length,columns:[...new Set(cards.map(c=>c.col))].length,noShadowClass:cards.filter(c=>c.noShadow).length,hovered:res.filter(r=>r[2]).length,shadowNone:res.filter(r=>r[0]==='none').length,borderDark:res.filter(r=>r[1]==='rgb(205, 213, 223)').length};
  await s.close(); }
fs.writeFileSync('ev/h4.json',JSON.stringify(out,null,1)); console.log(J(out,800));
