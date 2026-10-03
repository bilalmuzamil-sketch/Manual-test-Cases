import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs';
import {C} from '/tmp/qa8552/lib2.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'8552',dir:'/tmp/qa8552',cookies:C,vp:{width:1700,height:1050},dpr:2}); const pg=s.page; const OUT=[];
const btn=t=>pg.evaluate(t=>{const e=[...document.querySelectorAll('button,div,a,span')].find(x=>(x.innerText||'').trim()===t&&x.getBoundingClientRect().width>0);if(!e)return null;const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};},t);
const click=async t=>{const b=await btn(t); if(!b) throw new Error('no '+t); await pg.mouse.click(b.x,b.y); await pg.waitForTimeout(2500);};
const goDay=async d=>{const c=await pg.evaluate(id=>{const e=document.querySelector(`[data-test-id="button_mini_calendar_day_${id}"]`);if(!e)return null;const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};},d); if(!c) throw new Error('no mini '+d); await pg.mouse.click(c.x,c.y); await pg.waitForTimeout(3000);};
const SC=`(()=>{let sc=null,b=0;document.querySelectorAll('*').forEach(e=>{const o=e.scrollWidth-e.clientWidth;if(o>b&&e.clientWidth>150&&getComputedStyle(e).overflowX!=='visible'){b=o;sc=e;}});return sc;})()`;
const setScroll=p=>pg.evaluate(([sc,p])=>{const S=eval(sc);if(S)S.scrollLeft=p;return S?{sl:Math.round(S.scrollLeft),max:S.scrollWidth-S.clientWidth}:{sl:0,max:0};},[SC,p]);
const meas=()=>pg.evaluate(()=>{
  const labels=[...document.querySelectorAll('*')].filter(n=>!n.children.length&&/^(David Haynes|Julie Olson|Emily Madden|Brandi Smith|Karen Peck|John Ortiz)$/.test((n.textContent||'').trim())).map(n=>({who:n.textContent.trim(),y:n.getBoundingClientRect().y}));
  const vis=(el)=>{let r=el.getBoundingClientRect();let L=r.left,R=r.right,T=r.top,B=r.bottom;let p=el.parentElement;while(p&&p!==document.body){const cs=getComputedStyle(p);if(cs.overflowX!=='visible'||cs.overflow!=='visible'){const q=p.getBoundingClientRect();L=Math.max(L,q.left);R=Math.min(R,q.right);T=Math.max(T,q.top);B=Math.min(B,q.bottom);}p=p.parentElement;}
    // also anything sitting on top (sticky name column) - sample points
    let covered=0,n=0;for(let x=r.left+2;x<r.right-2;x+=6){if(x<L||x>R)continue;n++;const e=document.elementFromPoint(x,(r.top+r.bottom)/2);if(!e||!(el.contains(e)||e.contains(el)||e===el))covered++;}
    return {w:Math.round(r.width),visW:Math.max(0,Math.round(R-L)),pts:n,covered};};
  const blocks=[...document.querySelectorAll('.schedule-block, .schedule-event, [class*="month"] [class*="event"], [class*="month"] [class*="bar"]')].filter(e=>/Blackfoot/.test(e.textContent));
  const seen=new Set(); const out=[];
  for(const e of blocks){const leaf=[...e.querySelectorAll('*')].find(n=>!n.children.length&&/Blackfoot/.test(n.textContent));if(!leaf||seen.has(leaf))continue;seen.add(leaf);
    const r=e.getBoundingClientRect(); if(r.width<5)continue; const q=leaf.getBoundingClientRect(); const v=vis(leaf);
    const lab=labels.filter(l=>l.y<=r.y+45).sort((a,b)=>b.y-a.y)[0];
    out.push({who:lab?lab.who:'?',bar:[Math.round(r.left),Math.round(r.right)],y:Math.round(r.y),name:Math.round(q.left),nameW:v.w,visW:v.visW,covered:v.covered+'/'+v.pts,cls:(e.className||'').toString().replace(/schedule-block/g,'').replace(/\s+/g,' ').trim().slice(0,90)});}
  return out;});
const ver=await pg.evaluate(()=>document.querySelector('meta[name="app-version"]')?.content);
const rec=async(tag,shot)=>{const m=await meas(); 
  const st=await pg.evaluate(([sc])=>{const S=eval(sc);return S?{sl:Math.round(S.scrollLeft),max:S.scrollWidth-S.clientWidth,left:Math.round(S.getBoundingClientRect().left)}:{};},[SC]);
  OUT.push({tag,st,m}); console.log('##',tag,JSON.stringify(st)); m.forEach(x=>console.log('   ',x.who.padEnd(12),'bar',x.bar.join('..'),'name x',x.name,'w',x.nameW,'visible w',x.visW,'covered',x.covered,'|',x.cls));
  if(shot) await pg.screenshot({path:`/tmp/qa8552/p6/${tag.replace(/[^a-z0-9-]+/gi,'_')}.png`});};
await s.go('/schedule'); await pg.waitForTimeout(5000);
console.log('version',await pg.evaluate(()=>document.querySelector('meta[name="app-version"]')?.content));
const MODE=process.env.MODE||'day';
if(MODE==='day'){
for(const d of (process.env.DAYS||'2026-10-22').split(',')){
  await goDay(d); const init=await pg.evaluate(([sc])=>{const S=eval(sc);return S?Math.round(S.scrollLeft):0;},[SC]);
  const max=await pg.evaluate(([sc])=>{const S=eval(sc);return S?S.scrollWidth-S.clientWidth:0;},[SC]);
  for(const p of [init,0,Math.round(max/3),Math.round(2*max/3),max]){await setScroll(p);await pg.waitForTimeout(600);await rec(`day-${d}-sl${p}`,true);}
}} else {
for(const d of (process.env.DAYS||'2026-10-22').split(',')){
  await pg.setViewportSize({width:1700,height:1050}); await pg.waitForTimeout(1500);
  if(await btn('Day')) await click('Day');
  await goDay(d); await click(MODE==='week'?'Week':'Month');
  for(const w of [1700,1100,700]){
    await pg.setViewportSize({width:w,height:1050}); await pg.waitForTimeout(2500);
    const max=await pg.evaluate(([sc])=>{const S=eval(sc);return S?S.scrollWidth-S.clientWidth:0;},[SC]);
    const ps=max>20?[0,Math.round(max/3),Math.round(2*max/3),max]:[0];
    for(const p of ps){await setScroll(p);await pg.waitForTimeout(700);await rec(`${MODE}-${d}-w${w}-sl${p}`,true);}
  }
}}
fs.writeFileSync(`/tmp/qa8552/p6/${process.env.MODE||'day'}.json`,JSON.stringify(OUT)); await s.close();
