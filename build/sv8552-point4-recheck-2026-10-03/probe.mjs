import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs';
import {C} from '/tmp/qa8552/lib2.mjs';
const s=await open({env:'branch',ticket:'8552',dir:'/tmp/qa8552',cookies:C,vp:{width:1700,height:1050}});
const pg=s.page;
const goDay=async d=>{const c=await pg.evaluate(id=>{const e=document.querySelector(`[data-test-id="button_mini_calendar_day_${id}"]`);if(!e)return null;const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};},d);
  if(!c){console.log('no mini day',d);return false;} await pg.mouse.click(c.x,c.y); await pg.waitForTimeout(3000); return true;};
await s.go('/schedule'); await pg.waitForTimeout(5000);
console.log('url',pg.url());
const snap=()=>pg.evaluate(()=>{
  const sc=[...document.querySelectorAll('*')].filter(e=>e.scrollWidth-e.clientWidth>20&&e.clientWidth>400).sort((a,b)=>(b.scrollWidth-b.clientWidth)-(a.scrollWidth-a.clientWidth))[0];
  const box=sc.getBoundingClientRect(); const out=[];
  document.querySelectorAll('.schedule-block').forEach(e=>{const r=e.getBoundingClientRect(); if(r.width<150) return;
    const leaves=[...e.querySelectorAll('*')].filter(n=>n.children.length===0&&(n.textContent||'').trim().length>2&&n.getBoundingClientRect().width>0);
    const leaf=leaves[0]; let nm=null;
    if(leaf){const q=leaf.getBoundingClientRect(); let p=leaf,st='not-sticky'; while(p&&p!==e.parentElement){ if(getComputedStyle(p).position==='sticky'){st='sticky('+(p.className||'').toString().slice(0,30)+')';break;} p=p.parentElement;} nm={text:leaf.textContent.trim().slice(0,34),x:Math.round(q.x),w:Math.round(q.width),st};}
    out.push({cls:(e.className||'').toString().replace(/schedule-block/,'').trim().slice(0,50),bx:Math.round(r.x),bw:Math.round(r.width),y:Math.round(r.y),nm});});
  return {scroll:Math.round(sc.scrollLeft), max:sc.scrollWidth-sc.clientWidth, view:[Math.round(box.left),Math.round(box.right)], bars:out};
});
const setScroll=v=>pg.evaluate(v=>{const sc=[...document.querySelectorAll('*')].filter(e=>e.scrollWidth-e.clientWidth>20&&e.clientWidth>400).sort((a,b)=>(b.scrollWidth-b.clientWidth)-(a.scrollWidth-a.clientWidth))[0]; sc.scrollLeft=v;},v);
for(const d of process.argv.slice(2)){
  if(!await goDay(d)) continue;
  const a=await snap(); console.log('=====',d,'view',a.view.join('..'),'scroll',a.scroll,'max',a.max);
  for(const pos of [0, Math.round(a.max/3), Math.round(2*a.max/3), a.max]){
    await setScroll(pos); await pg.waitForTimeout(700); const b=await snap();
    console.log(' scroll',b.scroll); b.bars.forEach(x=>console.log('   ',(x.nm?x.nm.text:'?').padEnd(34),'bar',x.bx+'..'+(x.bx+x.bw),'y',x.y,'| name x',x.nm?x.nm.x:'-',x.nm?x.nm.st:'','|',x.cls));
  }
}
await s.close();
