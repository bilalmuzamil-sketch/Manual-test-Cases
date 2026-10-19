import {session,toView} from './rec.mjs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:1}); const p=s.page;
await s.go('/workorders?tab=all&search=Lamkin'); await p.waitForTimeout(3500); await toView(p,'tech_view'); await p.waitForTimeout(2500);
for(const v of ['tech_view','board_view']){ const b=await p.evaluate(t=>{const r=document.querySelector(`[data-test-id=${t}]`).getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};},`display_option_${v}`); await p.mouse.click(b.x,b.y); await p.waitForTimeout(3000);
 const seq=[]; for(let i=0;i<3;i++){ await p.keyboard.press('Tab'); await p.waitForTimeout(400); seq.push(await p.evaluate(()=>{const a=document.activeElement; return (a.dataset.testId||a.tagName).replace(/[0-9a-f-]{36}/,'<id>')+' '+(a.innerText||'').replace(/\s+/g,' ').slice(0,25);})); }
 console.log(v,JSON.stringify(seq)); }
await s.close();
