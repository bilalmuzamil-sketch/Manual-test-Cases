import {session,toView,narr,finish} from './rec.mjs'; import fs from 'fs';
const dir='/tmp/qa11310/vo05c'; const N=narr(dir);
const s=await session({vp:{width:1440,height:900},record:'/tmp/qa11310/rec05c'}); const p=s.page; const tLogin=Date.now(); const mk=await s.marker(); const log={};
const OWN=['display','tab','density','collapsedGroups']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const tip=()=>p.evaluate(()=>{const t=[...document.querySelectorAll('.q-tooltip')].find(x=>x.getBoundingClientRect().height>0); return t?t.innerText.trim():null;});
try{
 await s.go('/workorders?tab=all&search=S2-34941'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3000);
 const c=await p.evaluate(()=>{const c=[...document.querySelectorAll('.board-card')].find(c=>{const r=c.getBoundingClientRect(); return r.left>=0&&r.right<=1440&&r.width>0;}); const bs=[...c.querySelectorAll('.q-badge')]; const pl=bs.find(b=>!b.classList.contains('q-badge--floating')&&/[A-Z]/.test(b.innerText)); const ct=bs.filter(b=>/^\d+$/.test(b.innerText.trim())); const B=e=>{const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,w:r.width,h:r.height,t:e.innerText.trim()};}; return {pill:B(pl),counts:ct.map(B)};});
 await p.mouse.move(c.counts[0].x,c.counts[0].y,{steps:12}); await p.waitForTimeout(800);
 await N.cap(s,'n1',`SV-11405 · staging ${mk.version} · Board View card S2-34941 · pill "${c.pill.t}" ${c.pill.h.toFixed(0)} px tall · red ${c.counts[0].t} and blue ${c.counts[1].t}`);
 await p.mouse.move(c.counts[0].x,c.counts[0].y,{steps:4}); await p.waitForTimeout(900); const t1=await tip(); await p.mouse.move(5,5); await p.waitForTimeout(300); await p.mouse.move(c.counts[1].x,c.counts[1].y,{steps:10}); await p.waitForTimeout(900); const t2=await tip(); log.cardTips=[t1,t2];
 await N.cap(s,'n2',`Card hover text: red "${t1}" · blue "${t2}"`);
 const row=async v=>{ await toView(p,v); await p.waitForTimeout(2500); const l=await p.evaluate(()=>{const tr=[...document.querySelectorAll('tbody tr')].find(t=>t.innerText.includes('S2-34941')); const bs=[...tr.querySelectorAll('.q-badge')]; const pl=bs.find(b=>!b.classList.contains('q-badge--floating')&&/[A-Z]/.test(b.innerText)); const ct=bs.filter(b=>/^\d+$/.test(b.innerText.trim())); const B=e=>{const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText.trim()};}; return {pill:B(pl),counts:ct.map(B)};}); const ts=[]; for(const c of l.counts){ await p.mouse.move(5,5); await p.waitForTimeout(300); await p.mouse.move(c.x,c.y,{steps:10}); await p.waitForTimeout(900); ts.push(await tip()); } return {l,ts}; };
 const L=await row('list'); log.list=L;
 await N.cap(s,'n3',`List, same work order: pill "${L.l.pill.t}" · red ${L.l.counts[0].t} "${L.ts[0]}" · blue ${L.l.counts[1].t} "${L.ts[1]}"`);
 await s.go('/workorders?tab=all&search=S2-34941'); await p.waitForTimeout(3000); const T=await row('tech_view'); log.tech=T;
 await N.cap(s,'n4',`Tech View, same work order: pill "${T.l.pill.t}" · red "${T.ts[0]}" · blue "${T.ts[1]}" → PASSED`);
}catch(e){ log.err=e.message.slice(0,200); }
try{ const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); }catch(e){}
await finish(s,dir,N.ev,{tLogin,mk,log}); console.log(JSON.stringify({card:log.cardTips,list:log.list?.ts,tech:log.tech?.ts,err:log.err}));
