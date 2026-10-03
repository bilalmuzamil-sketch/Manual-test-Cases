import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs';
import {C} from '/tmp/qa8552/lib2.mjs';
import fs from 'fs';
const s=await open({env:'branch',ticket:'8552',dir:'/tmp/qa8552',cookies:C,vp:{width:1700,height:1050},dpr:2}); const pg=s.page; const G={};
const goDay=async d=>{const c=await pg.evaluate(id=>{const e=document.querySelector(`[data-test-id="button_mini_calendar_day_${id}"]`);const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};},d); await pg.mouse.click(c.x,c.y); await pg.waitForTimeout(3000);};
const setScroll=v=>pg.evaluate(v=>{const sc=[...document.querySelectorAll('*')].filter(e=>e.scrollWidth-e.clientWidth>20&&e.clientWidth>400).sort((a,b)=>(b.scrollWidth-b.clientWidth)-(a.scrollWidth-a.clientWidth))[0]; sc.scrollLeft=v; const r=sc.getBoundingClientRect(); return [r.left,r.top,r.right,r.bottom];},v);
const geo=()=>pg.evaluate(()=>[...document.querySelectorAll('.schedule-block')].filter(e=>e.getBoundingClientRect().width>150).map(e=>{const r=e.getBoundingClientRect();const leaf=[...e.querySelectorAll('*')].find(n=>!n.children.length&&(n.textContent||'').trim().length>2);const q=leaf.getBoundingClientRect();return{cls:(e.className||'').toString().includes('event')?'event':'shift',bar:[r.x,r.y,r.right,r.bottom],name:[q.x,q.y,q.right,q.bottom],text:leaf.textContent.trim()};}));
const ver=await pg.evaluate(()=>document.querySelector('meta[name="app-version"]')?.content);
await s.go('/schedule'); await pg.waitForTimeout(5000);
for(const [d,pos] of [['2026-10-05',1536],['2026-10-02',1300],['2026-10-21',1552]]){
  await goDay(d); const view=await setScroll(pos); await pg.waitForTimeout(900);
  G[d]={view,blocks:await geo(),hdr:await pg.evaluate(()=>document.body.innerText.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*,? [A-Z][a-z]+ \d+/)?.[0])};
  await pg.screenshot({path:`/tmp/qa8552/p4/cap-${d}.png`});
}
G.version=await pg.evaluate(()=>document.querySelector('meta[name="app-version"]')?.content); G.at=new Date().toISOString();
fs.writeFileSync('/tmp/qa8552/p4/geo.json',JSON.stringify(G,null,1)); console.log(JSON.stringify(G).slice(0,1500));
await s.close();
