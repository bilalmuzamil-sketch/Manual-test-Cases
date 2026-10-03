import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs';
import {C,HD} from '/tmp/qa8552/lib2.mjs'; import fs from 'fs';
const s=await open({env:'branch',ticket:'8552',dir:'/tmp/qa8552',cookies:C,vp:{width:1700,height:1050},dpr:2}); const pg=s.page; const G={};
const O='/tmp/qa8552/p7/';
await s.api('/api/iam/change-location',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({workplace_id:HD,workplace_timezone:'America/Edmonton'})});
const btn=t=>pg.evaluate(t=>{const e=[...document.querySelectorAll('button,div,a,span')].find(x=>(x.innerText||'').trim()===t&&x.getBoundingClientRect().width>0);if(!e)return null;const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};},t);
const click=async t=>{const b=await btn(t); await pg.mouse.click(b.x,b.y); await pg.waitForTimeout(2500);};
const goDay=async d=>{const c=await pg.evaluate(id=>{const e=document.querySelector(`[data-test-id="button_mini_calendar_day_${id}"]`);const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};},d); await pg.mouse.click(c.x,c.y); await pg.waitForTimeout(3000);};
const SC=`(()=>{let sc=null,b=0;document.querySelectorAll('*').forEach(e=>{const o=e.scrollWidth-e.clientWidth;if(o>b&&e.clientWidth>150&&getComputedStyle(e).overflowX!=='visible'){b=o;sc=e;}});return sc;})()`;
const scr=p=>pg.evaluate(([sc,p])=>{const S=eval(sc);if(p!==null&&p!==undefined)S.scrollLeft=p;const r=S.getBoundingClientRect();return{sl:Math.round(S.scrollLeft),max:S.scrollWidth-S.clientWidth,left:r.left,right:r.right};},[SC,p]);
const R=e=>{const r=e.getBoundingClientRect();return[r.left,r.top,r.right,r.bottom].map(v=>Math.round(v));};
const geo=(txt)=>pg.evaluate(txt=>{const R=e=>{const r=e.getBoundingClientRect();return[r.left,r.top,r.right,r.bottom].map(v=>Math.round(v));};
  const labels=[...document.querySelectorAll('*')].filter(n=>!n.children.length&&/^(1[0-2]|[1-9])\s?(AM|PM)$/.test((n.textContent||'').trim())&&n.getBoundingClientRect().width>0).map(n=>({t:n.textContent.trim(),r:R(n)}));
  const rows=[...document.querySelectorAll('*')].filter(n=>!n.children.length&&/^(Brandi Smith|Jason Johnson|Clayton Stephens|Emily Madden|David Haynes)$/.test((n.textContent||'').trim())).map(n=>({t:n.textContent.trim(),r:R(n)})).filter(o=>o.r[0]>300);
  const blocks=[...document.querySelectorAll('.schedule-block')].filter(e=>!txt||e.textContent.includes(txt)).map(e=>{const leaf=[...e.querySelectorAll('*')].find(n=>!n.children.length&&(n.textContent||'').trim().length>2);return{cls:String(e.className).replace(/schedule-block/g,'').trim(),r:R(e),name:leaf?R(leaf):null,text:leaf?leaf.textContent.trim().slice(0,40):''};});
  const hdr=(document.body.innerText.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*, [A-Z][a-z]+ \d+|[A-Z][a-z]{2} \d+ – (\d+|[A-Z][a-z]{2} \d+)/)||[''])[0];
  return {labels,rows,blocks,hdr};},txt);
const shot=async(k,txt)=>{G[k]={...(await geo(txt)),scroll:await scr(null)}; await pg.screenshot({path:O+k+'.png'}); console.log(k,JSON.stringify(G[k].scroll),G[k].hdr,'blocks',G[k].blocks.length);};
await s.go('/schedule'); await pg.waitForTimeout(5000);
G.version=await pg.evaluate(()=>document.querySelector('meta[name="app-version"]')?.content);
// C: Wed Oct 7 day view
await goDay('2026-10-07'); await shot('C-wed-oct7',null);
// D: Sat Oct 10 day view, scroll 0 and max
await goDay('2026-10-10'); let d=await scr(0); await pg.waitForTimeout(700); await shot('D-sat-sl0',null); await scr(d.max); await pg.waitForTimeout(700); await shot('D-sat-max',null);
// B: Fri Oct 9, right-click empty cell on Clayton Stephens row, then Create Event
await goDay('2026-10-09'); await pg.waitForTimeout(800);
const cs=await pg.evaluate(()=>{const n=[...document.querySelectorAll('*')].filter(n=>!n.children.length&&(n.textContent||'').trim()==='Clayton Stephens').map(n=>n.getBoundingClientRect()).find(r=>r.x>300);return n?n.y+15:null;});
const sb=await scr(null); const X=Math.round(sb.right-260), Y=Math.round(cs);
await shot('B-0-before',null); G.B_click={x:X,y:Y};
await pg.mouse.click(X,Y,{button:'right'}); await pg.waitForTimeout(2000); await shot('B-1-menu',null);
const ce=await pg.evaluate(()=>{const n=[...document.querySelectorAll('.q-menu *,[role=menu] *')].find(e=>/^create event$/i.test((e.textContent||'').trim())&&e.children.length===0);if(!n)return null;const r=n.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2,r:[r.left,r.top,r.right,r.bottom]};});
G.B_menuitem=ce; if(ce){await pg.mouse.click(ce.x,ce.y); await pg.waitForTimeout(3000); await shot('B-2-dialog',null);
  G.B_dialog=await pg.evaluate(()=>{const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].find(e=>e.getBoundingClientRect().width>0);if(!d)return null;const r=d.getBoundingClientRect();return[r.left,r.top,r.right,r.bottom];});
  await pg.keyboard.press('Escape'); await pg.waitForTimeout(1500);}
// A: Week view of Oct 5 at 700, "Jarod off"
await pg.setViewportSize({width:1700,height:1050}); await goDay('2026-10-05'); await click('Week');
await pg.setViewportSize({width:700,height:1750}); await pg.waitForTimeout(2500);
let a0=await scr(0); await pg.waitForTimeout(600); const ga=await geo('Jarod off'); const jb=ga.blocks[0]; G.A_at0={scroll:a0,block:jb};
console.log('A block at 0',JSON.stringify(jb));
if(jb){ for(const rem of [90,24]){ const p=Math.max(0,Math.round(jb.r[2]-a0.left-rem)); await scr(p); await pg.waitForTimeout(800); await shot('A-week700-rem'+rem,'Jarod off'); } }
// E: Week view of Oct 21 at 700, Brandi single-day job
await pg.setViewportSize({width:1700,height:1050}); await pg.waitForTimeout(1200); await click('Day'); await goDay('2026-10-21'); await click('Week');
await pg.setViewportSize({width:700,height:1750}); await pg.waitForTimeout(2500); await scr(0); await pg.waitForTimeout(600); await shot('E-week700-sl0','Blackfoot');
const eb=G['E-week700-sl0']; console.log('E rows',JSON.stringify(eb.rows),'blocks',JSON.stringify(eb.blocks.map(b=>[b.cls,b.r])));
await scr(252); await pg.waitForTimeout(800); await shot('E-week700-sl252','Blackfoot');
G.version2=await pg.evaluate(()=>document.querySelector('meta[name="app-version"]')?.content); G.at=new Date().toISOString();
fs.writeFileSync(O+'geo.json',JSON.stringify(G)); console.log('version',G.version,G.version2,G.at);
await s.close();
