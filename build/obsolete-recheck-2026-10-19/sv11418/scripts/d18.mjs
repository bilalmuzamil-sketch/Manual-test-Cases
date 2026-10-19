// SV-11418 observation run: Time Clock ON baseline -> OFF via Settings > Staff -> Board / Tech / List / WO page
import {session,toView} from './rec.mjs'; import fs from 'fs';
const phase='drag';
const s=await session({vp:{width:1440,height:900},record:'/tmp/qa11310/rec18d'}); const p=s.page; const log={mk:await s.marker(),phase};
const OWN=['display','tab','density','collapsedGroups']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const Q='ZZAUTOTEST F2 Sort'; const SH='/tmp/qa11310/ex18/'+phase+'-';
const reqs=[]; p.on('response',async r=>{ const q=r.request(); if(/\/api\/staff\//.test(q.url())&&q.method()!=='GET') reqs.push({m:q.method(),u:q.url(),st:r.status(),b:(q.postData()||'').slice(0,800)}); });
const cols=()=>p.evaluate(()=>[...document.querySelectorAll('.board-column__panel')].map(pn=>{const h=pn.querySelector('[data-test-id^=board_column_header_]'); return {tid:h?.dataset.testId,head:(h?.innerText||'').replace(/\s+/g,' ').trim(),grip:pn.querySelectorAll('[data-test-id^=board_column_drag_handle_]').length,cards:[...pn.querySelectorAll('.board-card')].map(c=>{const t=c.innerText; return (t.match(/S\d*-\d+/)||[])[0];})};}).filter(c=>c.cards.length||/Wes/.test(c.head)));
const findCol=async(re)=>{ await p.evaluate(()=>{document.querySelector('[data-test-id=board_view_scroller]').scrollLeft=0;}); await p.waitForTimeout(500); const seen={};
 for(let i=0;i<120;i++){ const r=await p.evaluate((src)=>{const R=new RegExp(src); const out=[]; for(const pn of document.querySelectorAll('.board-column__panel')){ const h=pn.querySelector('[data-test-id^=board_column_header_]'); const head=(h?.innerText||'').replace(/\s+/g,' ').trim(); const cards=[...pn.querySelectorAll('.board-card')].map(c=>(c.innerText.match(/S\d*-\d+/)||[])[0]); const inact=[...(h?h.querySelectorAll('*'):[])].filter(e=>e.children.length===0&&/inactive/i.test(e.innerText)).map(e=>e.innerText.trim()); out.push({tid:h?.dataset.testId,head,grip:pn.querySelectorAll('[data-test-id^=board_column_drag_handle_]').length,inact,cards,match:R.test(head)}); } return out;},re.source);
  for(const c of r) if(c.cards.length||c.match) seen[c.tid]=c; const hit=r.find(c=>c.match); if(hit){ await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`).scrollIntoView({inline:'center',block:'nearest'}),hit.tid); await p.waitForTimeout(800); return {hit,seen:Object.values(seen)}; }
  const end=await p.evaluate(()=>{const sc=document.querySelector('[data-test-id=board_view_scroller]'); const e=sc.scrollLeft+sc.clientWidth>=sc.scrollWidth-5; sc.scrollLeft+=900; return e;}); await p.waitForTimeout(350); if(end) break; }
 return {hit:null,seen:Object.values(seen)}; };
const findGroup=async(re)=>{ await p.evaluate(()=>{const m=document.querySelector('.q-table__middle'); if(m) m.scrollTop=0;}); await p.waitForTimeout(500); const seen={};
 for(let i=0;i<150;i++){ const r=await p.evaluate((src)=>{const R=new RegExp(src); return [...document.querySelectorAll('[data-test-id^=tech_view_group_name_]')].map(g=>{const tr=g.closest('tr'); return {tid:g.dataset.testId,t:(tr||g).innerText.replace(/\s+/g,' ').slice(0,140),match:R.test(g.innerText)};});},re.source);
  for(const g of r) seen[g.tid]=g; const hit=r.find(g=>g.match); if(hit){ await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`).scrollIntoView({block:'center'}),hit.tid); await p.waitForTimeout(900); const rows=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(t=>t.innerText.replace(/\s+/g,' ').slice(0,200)).filter(t=>/S2-3731[9]|S2-37320/.test(t))); return {hit,rows}; }
  const end=await p.evaluate(()=>{const m=document.querySelector('.q-table__middle'); const e=m.scrollTop+m.clientHeight>=m.scrollHeight-5; m.scrollTop+=500; return e;}); await p.waitForTimeout(300); if(end) break; }
 return {hit:null,rows:[],seen:Object.values(seen).filter(g=>/Wes|Unassigned/.test(g.t))}; };
const staffClock=async()=>{ const r=(await s.api('/api/staff?limit=100&search=Wes%20Hover')).json.data.collection.find(x=>/Wes Hover/.test(x.last_name)); return {clockable:r?.clockable,active:r?.is_active,role:r?.role_label,deps:r?.departments}; };

const drag=async(from,to)=>{ await p.mouse.move(from.x,from.y,{steps:8}); await p.mouse.down(); for(const d of [3,6,9,12]){ await p.mouse.move(from.x+d,from.y+d); await p.waitForTimeout(40);} for(let i=1;i<=24;i++){ await p.mouse.move(from.x+(to.x-from.x)*i/24,from.y+(to.y-from.y)*i/24); await p.waitForTimeout(55);} await p.waitForTimeout(700); await p.mouse.up(); await p.waitForTimeout(1200); };
const toasts=()=>p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/check_circle|Close|error|warning|info/g,'').replace(/\s+/g,' ').trim()));
const dialogs=()=>p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>({t:d.innerText.replace(/\s+/g,' ').slice(0,300),b:[...d.querySelectorAll('button')].map(b=>(b.dataset.testId||'')+':'+b.innerText.trim())})));
const lead=async n=>{ const w=(await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=3&search='+n)).json.data.work_orders[0]; return ((w.techAssignedFirstName||'')+' '+(w.techAssignedLastName||'')).trim()||'(none)'; };
const card=n=>p.evaluate(n=>{const c=[...document.querySelectorAll('.board-card')].find(e=>e.innerText.includes(n)); if(!c) return null; const r=c.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+40};},n);
const colBody=tid=>p.evaluate(t=>{const h=document.querySelector(`[data-test-id="${t}"]`); const pn=h.closest('.board-column__panel'); const r=pn.getBoundingClientRect(); return {x:r.x+r.width/2,y:Math.min(r.y+r.height-30,r.y+300)};},tid);
const WT='board_column_header_d1879db8-30dd-47b4-b8ad-97e9cf1d4c67'; const UT='board_column_header_unassigned';
try{
 log.staff=await staffClock();
 await s.go('/workorders?tab=all&search='+encodeURIComponent(Q)); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3500);
 log.c0=(await findCol(/Wes Hover/)).hit; await p.screenshot({path:SH+'0-start.png'});
 // 1) drop an unassigned card onto Wes's column
 const a=await card('S2-37321'); const tb=await colBody(WT); log.a=a; log.tb=tb;
 await drag(a,tb); log.drop={toasts:await toasts(),dialogs:await dialogs()}; await p.screenshot({path:SH+'1-drop.png'});
 await p.waitForTimeout(2500); log.drop.lead=await lead('S2-37321'); log.drop.col=(await findCol(/Wes Hover/)).hit; await p.screenshot({path:SH+'1b-after-drop.png'});
 // 2) drag S2-37319 out to Unassigned
 for(const n of ['S2-37319','S2-37320']){ const f=await findCol(/Wes Hover/); if(!f.hit) break; const c=await card(n); const u=await colBody(UT); await drag(c,u); const o={n,toasts:await toasts(),dialogs:await dialogs()}; await p.screenshot({path:SH+'2-'+n+'-dragout.png'});
   for(const d of o.dialogs){ log['dlg_'+n]=d; }
   // confirm a shift-clearing / reassignment prompt if shown (Rule 102: re-read after the click)
   if(o.dialogs.length){ const btn=o.dialogs[0].b.find(b=>/keep|confirm|yes|move|reassign|continue|unassign/i.test(b)); o.clicked=btn||null; if(btn){ const tid=btn.split(':')[0]; if(tid) await p.click(`[data-test-id="${tid}"]`); else await p.click(`.q-dialog button:has-text("${btn.split(':')[1]}")`); await p.waitForTimeout(1500); o.dialogs2=await dialogs(); o.toasts2=await toasts(); } }
   await p.waitForTimeout(2500); o.lead=await lead(n); log['out_'+n]=o; }
 const f2=await findCol(/Wes Hover/); log.colAfter=f2.hit; log.unassignedAfter=f2.seen.filter(c=>/unassigned/.test(c.tid||'')).map(c=>c.cards); await p.screenshot({path:SH+'3-after-out.png'});
 await toView(p,'tech_view'); await p.waitForTimeout(3500); log.groupAfter=(await findGroup(/Wes Hover/)).hit; await p.screenshot({path:SH+'4-tech.png'});
}catch(e){ log.err=e.message.slice(0,300); }
try{ const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); }catch(e){}
fs.writeFileSync('/tmp/qa11310/ex18/drag.json',JSON.stringify(log,null,1)); console.log('DONE'); await s.close();
