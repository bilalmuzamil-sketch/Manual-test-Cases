// SV-11418 observation run: Time Clock ON baseline -> OFF via Settings > Staff -> Board / Tech / List / WO page
import {session,toView} from './rec.mjs'; import fs from 'fs';
const phase='drop2';
const s=await session({vp:{width:1440,height:900},record:'/tmp/qa11310/rec18e'}); const p=s.page; const log={mk:await s.marker(),phase};
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

const W='d1879db8-30dd-47b4-b8ad-97e9cf1d4c67';
const clock=async v=>(await s.api(`/api/staff/${W}/change`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({first_name:'ZZAUTOTEST DC15',last_name:'Wes Hover',email:'zz.wob.dc15.wes@staging.shopview.local',role_id:'af8d02b5-ecd1-4205-a82f-32a4d5bb1015',workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',job_title:null,salary_type:null,salary:null,billable:0,clockable:v,is_sales_rep:false})})).status;
const watchToasts=async(ms)=>{ const seen=new Set(); const t0=Date.now(); while(Date.now()-t0<ms){ for(const x of await toasts()) seen.add(x); await p.waitForTimeout(150);} return [...seen]; };
const dragW=async(from,to,shot)=>{ await p.mouse.move(from.x,from.y,{steps:8}); await p.mouse.down(); for(const d of [3,6,9,12]){ await p.mouse.move(from.x+d,from.y+d); await p.waitForTimeout(40);} for(let i=1;i<=24;i++){ await p.mouse.move(from.x+(to.x-from.x)*i/24,from.y+(to.y-from.y)*i/24); await p.waitForTimeout(55);} await p.waitForTimeout(700); await p.screenshot({path:shot}); await p.mouse.up(); return await watchToasts(5000); };
try{
 log.on=await clock(true); log.mv=(await s.api('/api/work-orders/965b2372-1ab3-46ef-b367-97944cd73aae/board-move',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({technicianId:W})})).status; log.off=await clock(false);
 log.staff=await staffClock(); log.lead37319=await lead('S2-37319');
 await s.go('/workorders?tab=all&search='+encodeURIComponent(Q)); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3500);
 log.c0=(await findCol(/Wes Hover/)).hit; await p.waitForTimeout(800);
 const a=await card('S2-37321'); const tb=await colBody(WT); log.pts={a,tb};
 log.boardDrop={toasts:await dragW(a,tb,SH+'board-hover.png'),dialogs:await dialogs()}; await p.screenshot({path:SH+'board-after.png'});
 log.boardDrop.lead=await lead('S2-37321');
 await toView(p,'tech_view'); await p.waitForTimeout(3500);
 const g=await findGroup(/Wes Hover/); log.g=g.hit;
 const pos=await p.evaluate(()=>{ const row=[...document.querySelectorAll('tbody tr')].find(t=>t.innerText.includes('S2-37321')); const h=row?.querySelector('[data-test-id*=drag_handle],[class*=drag]'); const r=(h||row).getBoundingClientRect(); const gh=document.querySelector('[data-test-id="tech_view_group_name_d1879db8-30dd-47b4-b8ad-97e9cf1d4c67"]').getBoundingClientRect(); return {from:{x:r.x+r.width/2,y:r.y+r.height/2,handle:!!h},to:{x:gh.x+200,y:gh.y+gh.height+20}}; });
 log.techPos=pos;
 if(pos.from.y>0&&pos.from.y<900) { log.techDrop={toasts:await dragW(pos.from,pos.to,SH+'tech-hover.png'),dialogs:await dialogs()}; await p.screenshot({path:SH+'tech-after.png'}); log.techDrop.lead=await lead('S2-37321'); }
}catch(e){ log.err=e.message.slice(0,300); }
try{ const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); }catch(e){}
fs.writeFileSync('/tmp/qa11310/ex18/drop2.json',JSON.stringify(log,null,1)); console.log('DONE'); await s.close();
