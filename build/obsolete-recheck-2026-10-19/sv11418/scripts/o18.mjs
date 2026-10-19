// SV-11418 observation run: Time Clock ON baseline -> OFF via Settings > Staff -> Board / Tech / List / WO page
import {session,toView} from './rec.mjs'; import fs from 'fs';
const phase=process.argv[2]||'off';
const s=await session({vp:{width:1440,height:900}}); const p=s.page; const log={mk:await s.marker(),phase};
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
try{
 log.staff0=await staffClock();
 if(phase==='off'||phase==='on'){
  const want=phase==='on';
  await s.go('/administration/staff'); await p.waitForTimeout(3500);
  await p.click('[data-test-id=page_search_toggle]'); await p.waitForTimeout(500); await p.keyboard.type('Wes Hover'); await p.waitForTimeout(2500);
  const row=await p.$('[data-test-id=table_staff] tbody tr:has-text("Wes Hover")'); await (await row.$('[data-test-id=staff_edit_button]')).click(); await p.waitForTimeout(2500);
  const cur=await p.getAttribute('[data-test-id=toggle_time_clock]','aria-checked'); log.toggleBefore=cur;
  await p.screenshot({path:SH+'dialog-before.png'});
  if((cur==='true')!==want){ await p.click('[data-test-id=toggle_time_clock]'); await p.waitForTimeout(800); }
  log.toggleAfter=await p.getAttribute('[data-test-id=toggle_time_clock]','aria-checked');
  await p.screenshot({path:SH+'dialog-toggled.png'});
  await p.click('[data-test-id=button_save_staff]'); await p.waitForTimeout(2000);
  log.afterSave=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ').slice(0,300)));
  log.afterSaveBtns=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].map(b=>(b.dataset.testId||'')+':'+b.innerText.trim()).slice(0,12));
  await p.screenshot({path:SH+'after-save.png'});
  log.toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ').trim()));
  await p.waitForTimeout(1500);
 }
 log.staff1=await staffClock();
 await s.go('/workorders?tab=all&search='+encodeURIComponent(Q)); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3500);
 log.board=await findCol(/Wes Hover/); log.unassignedBoard=log.board.seen.filter(c=>/unassigned/.test(c.tid||'')); await p.screenshot({path:SH+'board.png'});
 await toView(p,'tech_view'); await p.waitForTimeout(3500);
 log.tech=await findGroup(/Wes Hover/); if(!log.tech.hit){ log.techU=await findGroup(/^\s*Unassigned/); }
 await p.screenshot({path:SH+'tech.png'});
 await toView(p,'list'); await p.waitForTimeout(3500);
 log.list=await p.evaluate(()=>{const hs=[...document.querySelectorAll('thead th')].map(h=>h.innerText.trim()); const i=hs.findIndex(h=>/Lead Tech/i.test(h)); return {i,rows:[...document.querySelectorAll('tbody tr')].filter(t=>/S2-3731[9]|S2-37320/.test(t.innerText)).map(t=>({n:(t.innerText.match(/S\d*-\d+/)||[])[0],lead:t.children[i]?.innerText.trim()}))};});
 await p.screenshot({path:SH+'list.png'});
 const L=(await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=3&search=S2-37319')).json.data.work_orders[0]; log.apiLead=[L.techAssignedId,L.techAssignedFirstName,L.techAssignedLastName];
 await s.go('/workorders/965b2372-1ab3-46ef-b367-97944cd73aae/lines'); await p.waitForTimeout(4500);
 log.woPage=await p.evaluate(()=>{const e=[...document.querySelectorAll('[data-test-id*=lead_technician],[data-test-id*=tech_assigned]')].map(x=>x.dataset.testId+':'+x.innerText.replace(/\s+/g,' ').slice(0,80)); return {url:location.pathname,e};});
 await p.screenshot({path:SH+'wo.png'});
}catch(e){ log.err=e.message.slice(0,300); }
try{ const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); }catch(e){}
fs.writeFileSync('/tmp/qa11310/ex18/'+phase+'.json',JSON.stringify({log,reqs},null,1)); console.log(JSON.stringify({log,reqs}).slice(0,5000)); await s.close();
