import {session,toView} from './rec.mjs'; import fs from 'fs';
const N='S2-35709', Q='ZZAUTOTEST F1 Assigned To Me';
const s=await session({quick:'admin',vp:{width:1440,height:1100},dpr:2}); const p=s.page; const out={};
const OWN=['display','collapsedGroups','tab'];
const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const putP=async v=>(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status;
const prefs0=await getP();
const wo=async n=>{ const r=await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=3&search='+n); const w=r.json.data.work_orders[0]; return {lead:w.techAssignedId,name:((w.techAssignedFirstName||'')+' '+(w.techAssignedLastName||'')).trim()}; };
const drag=async(from,to)=>{ await p.mouse.move(from.x,from.y); await p.mouse.down(); for(const d of [3,6,9,12]){ await p.mouse.move(from.x+d,from.y+d); await p.waitForTimeout(40);} for(let i=1;i<=24;i++){ await p.mouse.move(from.x+(to.x-from.x)*i/24,from.y+(to.y-from.y)*i/24); await p.waitForTimeout(55);} await p.waitForTimeout(500); await p.mouse.up(); await p.waitForTimeout(2500); };
try{
 out.wo0=await wo(N); console.log('before',JSON.stringify(out.wo0));
 await s.go('/workorders?tab=all&search='+encodeURIComponent(Q)); await p.waitForTimeout(3500); await toView(p,'tech_view'); await p.waitForTimeout(2500);
 for(let k=0;k<2;k++){ if(/Expand/.test(await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'))) break; await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);} await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(3000);
 for(let i=0;i<80;i++){ const f=await p.evaluate(()=>!!document.querySelector('[data-test-id=tech_view_group_deleted]')); if(f) break; await p.evaluate(()=>{document.querySelector('.q-table__middle').scrollTop+=500;}); await p.waitForTimeout(400); }
 await p.evaluate(()=>{const g=document.querySelector('[data-test-id=tech_view_group_deleted]'); const m=document.querySelector('.q-table__middle'); m.scrollTop+=g.getBoundingClientRect().top-m.getBoundingClientRect().top-380;}); await p.waitForTimeout(1500);
 await p.evaluate(n=>{const r=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].find(c=>c.innerText.includes(n)); r?.scrollIntoView({block:'center'});},N); await p.waitForTimeout(1500);
 const geo=await p.evaluate(n=>{const all=[...document.querySelectorAll('tr')]; const del=document.querySelector('[data-test-id=tech_view_group_deleted]'); const rows=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].filter(c=>/^tech_view_row_[0-9a-f-]{36}$/.test(c.dataset.testId)); const r=rows.find(c=>c.innerText.includes(n)); const groups=all.filter(t=>t.querySelector('[data-test-id^=tech_view_group_drag_handle_]')); const above=groups.filter(g=>g.getBoundingClientRect().bottom<=del.getBoundingClientRect().top+1).pop(); const h=r?.querySelector('[data-test-id^=tech_view_row_drag_handle_]')?.getBoundingClientRect(); const ab=above?.getBoundingClientRect(); return {row:!!r,from:h?{x:h.x+h.width/2,y:h.y+h.height/2}:null,target:above?{name:above.innerText.replace(/\s+/g,' ').slice(0,50),tid:above.dataset.testId,x:700,y:ab.y+ab.height/2}:null};},N);
 console.log('geo',JSON.stringify(geo)); await p.mouse.move(1435,1095); await p.screenshot({path:'/tmp/qa11310/ev10/s16m-tech-before.png'});
 out.geo=geo;
 if(geo.from&&geo.target){ const b=s.writes.length; await drag(geo.from,geo.target); out.writes=s.writes.slice(b).map(w=>w.slice(0,120)); out.dialogs=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().height>0).map(x=>x.innerText.replace(/\s+/g,' ').slice(0,200)));
  const keep=await p.$('[data-test-id=button_clear_shifts_keep]'); if(keep){ await keep.click(); await p.waitForTimeout(2000);} 
  out.toast=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' '))); out.woOut=await wo(N); await p.mouse.move(1435,1095); await p.waitForTimeout(800); await p.screenshot({path:'/tmp/qa11310/ev10/s16m-tech-after.png'});
  out.deletedGroupAfter=await p.evaluate(()=>document.querySelector('[data-test-id=tech_view_group_deleted]')?.innerText.replace(/\s+/g,' ')||'(gone)');
  console.log('after',JSON.stringify(out.woOut),JSON.stringify(out.writes),JSON.stringify(out.dialogs),JSON.stringify(out.toast),out.deletedGroupAfter); }
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await putP(v);
fs.writeFileSync('/tmp/qa11310/ev10/s16m.json',JSON.stringify(out,null,1)); await s.close();
