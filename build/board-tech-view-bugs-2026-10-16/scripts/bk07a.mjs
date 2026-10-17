import {session,toView} from './rec.mjs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:1}); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(4000);
for(const v of ['board_view','tech_view']){
 await toView(p,v); await p.waitForTimeout(2500);
 const r=await p.evaluate(()=>{const out=[]; for(const e of document.querySelectorAll('*')){const cs=getComputedStyle(e); if((/(auto|scroll)/.test(cs.overflowY)&&e.scrollHeight>e.clientHeight+5)||(/(auto|scroll)/.test(cs.overflowX)&&e.scrollWidth>e.clientWidth+5)){const b=e.getBoundingClientRect(); out.push({tid:e.dataset.testId||'',cls:(e.className||'').toString().slice(0,50),oy:cs.overflowY,ox:cs.overflowX,sh:e.scrollHeight,ch:e.clientHeight,sw:e.scrollWidth,cw:e.clientWidth,x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height)});}} return {doc:{sh:document.documentElement.scrollHeight,ch:innerHeight,sw:document.documentElement.scrollWidth},out:out.slice(0,15),url:location.href};});
 console.log(v,JSON.stringify(r));
}
await s.close();
