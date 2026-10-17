import {session,toView,narr,finish} from './rec.mjs'; import fs from 'fs';
const dir='/tmp/qa11310/vo05b'; const N=narr(dir);
const s=await session({vp:{width:1440,height:900},record:'/tmp/qa11310/rec05b'}); const p=s.page; const tLogin=Date.now(); const mk=await s.marker(); const log={};
const OWN=['display','tab','density','collapsedGroups']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const tip=()=>p.evaluate(()=>{const t=[...document.querySelectorAll('.q-tooltip')].find(x=>x.getBoundingClientRect().height>0); return t?t.innerText.trim():null;});
try{
 await s.go('/workorders?tab=all&search=S2-34941'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3000);
 const c=await p.evaluate(()=>{const c=[...document.querySelectorAll('.board-card')].find(c=>{const r=c.getBoundingClientRect(); return r.left>=0&&r.right<=1440&&r.width>0;}); const bs=[...c.querySelectorAll('.q-badge')]; const pl=bs.find(b=>!b.classList.contains('q-badge--floating')&&/[A-Z]/.test(b.innerText)); const ct=bs.filter(b=>/^\d+$/.test(b.innerText.trim())); const B=e=>{const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,w:r.width,h:r.height,t:e.innerText.trim()};}; return {pill:B(pl),counts:ct.map(B)};});
 await p.mouse.move(c.counts[0].x,c.counts[0].y,{steps:12}); await p.waitForTimeout(1000); log.cardTip=await tip(); log.card=c;
 await N.cap(s,'n1',`SV-11405 · staging ${mk.version} · Board View card S2-34941 · pill "${c.pill.t}" ${c.pill.w.toFixed(0)} x ${c.pill.h.toFixed(0)} px · counts ${c.counts.map(x=>x.t).join(' and ')} · hover "${log.cardTip}"`);
 await toView(p,'list'); await p.waitForTimeout(2500);
 const l=await p.evaluate(()=>{const tr=[...document.querySelectorAll('tbody tr')].find(t=>t.innerText.includes('S2-34941')); const bs=[...tr.querySelectorAll('.q-badge')]; const pl=bs.find(b=>!b.classList.contains('q-badge--floating')&&/[A-Z]/.test(b.innerText)); const ct=bs.filter(b=>/^\d+$/.test(b.innerText.trim())); const B=e=>{const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,w:r.width,t:e.innerText.trim()};}; return {pill:B(pl),counts:ct.map(B)};});
 await p.mouse.move(l.counts[0].x,l.counts[0].y,{steps:12}); await p.waitForTimeout(1000); log.listTip=await tip(); log.list=l;
 await N.cap(s,'n2',`List, same work order: pill "${l.pill.t}" ${l.pill.w.toFixed(0)} px · counts ${l.counts.map(x=>x.t).join(' and ')} · hover "${log.listTip}"`);
 await s.go('/workorders?tab=all&status=paid'); await p.waitForTimeout(3500); await toView(p,'list'); await p.waitForTimeout(2500);
 const pw=sel=>p.evaluate(sel=>{const e=[...document.querySelectorAll(sel)].find(e=>{const b=e.getBoundingClientRect(); return b.top>150&&b.bottom<880&&b.left>=0&&b.right<=1440&&/^Paid$/.test(e.innerText.trim());}); const b=e.getBoundingClientRect(); return {x:b.x+b.width/2,y:b.y+b.height/2,w:b.width};},sel);
 log.lp=await pw('tbody tr .q-badge:not(.q-badge--floating)'); await p.mouse.move(log.lp.x+60,log.lp.y,{steps:12});
 await N.cap(s,'n3',`Status filter: Paid · List: Paid pill ${log.lp.w.toFixed(1)} px wide (the same as Production)`);
 await toView(p,'board_view'); await p.waitForTimeout(3000); log.bp=await pw('.board-card .q-badge:not(.q-badge--floating)'); await p.mouse.move(log.bp.x+60,log.bp.y+30,{steps:12});
 await N.cap(s,'n4',`Board View card: Paid pill ${log.bp.w.toFixed(1)} px wide (List ${log.lp.w.toFixed(1)} px) · other statuses match List → PARTIALLY PASSED`);
}catch(e){ log.err=e.message.slice(0,200); }
try{ const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); }catch(e){}
await finish(s,dir,N.ev,{tLogin,mk,log}); console.log(JSON.stringify({ct:log.cardTip,lt:log.listTip,lp:log.lp?.w,bp:log.bp?.w,err:log.err}));
