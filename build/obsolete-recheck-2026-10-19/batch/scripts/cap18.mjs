// SV-11418 clean recapture with element rects: Time Clock on (before) -> off (after) -> drop refused -> restore
import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:2}); const p=s.page; const log={mk:await s.marker()}; const J={method:'POST',headers:{'Content-Type':'application/json'}};
const W='d1879db8-30dd-47b4-b8ad-97e9cf1d4c67'; const K=JSON.parse(fs.readFileSync('/tmp/qa11310/ex20/k5.json')).cust;
const OWN=['display','tab','density','collapsedGroups']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const staff=v=>s.api(`/api/staff/${W}/change`,{...J,body:JSON.stringify({first_name:'Wes',last_name:'Hover',email:'zz.wob.dc15.wes@staging.shopview.local',role_id:'af8d02b5-ecd1-4205-a82f-32a4d5bb1015',workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',job_title:null,salary_type:null,salary:null,billable:0,clockable:v,is_sales_rep:false})}).then(r=>r.status);
const R=sel=>p.evaluate(sel=>{const e=typeof sel==='string'?document.querySelector(sel):null; if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};},sel);
const colRect=async re=>{ for(let i=0;i<120;i++){ const ok=await p.evaluate(src=>{const h=[...document.querySelectorAll('[data-test-id^=board_column_header_]')].find(e=>new RegExp(src).test(e.innerText)); if(h){ h.scrollIntoView({inline:'center',block:'nearest'}); return true;} document.querySelector('[data-test-id=board_view_scroller]').scrollLeft+=900; return false;},re); if(ok) break; await p.waitForTimeout(300);} await p.waitForTimeout(1200);
 return p.evaluate(src=>{const h=[...document.querySelectorAll('[data-test-id^=board_column_header_]')].find(e=>new RegExp(src).test(e.innerText)); const pn=h.closest('.board-column__panel'); const a=h.getBoundingClientRect(), b=pn.getBoundingClientRect(); return {head:{x:a.x,y:a.y,w:a.width,h:a.height,t:h.innerText.replace(/\s+/g,' ').trim()},panel:{x:b.x,y:b.y,w:b.width,h:b.height},cards:[...pn.querySelectorAll('.board-card')].map(c=>{const r=c.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,t:(c.innerText.match(/S\d-\d+/)||[])[0]};})};},re); };
try{
 log.rename=await staff(true);
 log.wo=JSON.parse(fs.readFileSync('/tmp/qa11310/ex21/cap18-wo.json')); if(false) for(const k of ['A','M','Z']){ const c=await s.api('/api/work-orders/create',{...J,body:JSON.stringify({company_id:K[k].cid,vehicle_id:K[k].vid,workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',start_date:new Date().toISOString().slice(0,19).replace('T',' '),is_vehicle_here:true})}); const id=c.json.data.work_order_id; const w=(await s.api('/api/work-orders/view/'+id)).json.data; log.wo[k]={id,n:(w.work_order||w).number.replace(/^S-/,'S2-')}; }
 if(false) for(const k of ['A','M']) log['mv'+k]=(await s.api(`/api/work-orders/${log.wo[k].id}/board-move`,{...J,body:JSON.stringify({technicianId:W})})).status;
 fs.writeFileSync('/tmp/qa11310/ex21/cap18-wo.json',JSON.stringify(log.wo));
 // BEFORE: Time Clock on
 await s.go('/workorders?tab=all&search=QA1019'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3500);
 log.before=await colRect('Wes Hover'); await p.mouse.move(700,880); await p.screenshot({path:'/tmp/qa11310/ex21/b0-board-on.png'});
 // Settings > Staff > Edit > Time Clock off (UI)
 await s.go('/administration/staff'); await p.waitForTimeout(3500); await p.click('[data-test-id=page_search_toggle]'); await p.waitForTimeout(500); await p.keyboard.type('Hover'); await p.waitForTimeout(2500);
 const row=await p.$('[data-test-id=table_staff] tbody tr:has-text("Wes"):has-text("Hover")'); log.rowsSeen=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id=table_staff] tbody tr')].map(t=>t.innerText.replace(/\s+/g,' ').slice(0,60))); log.staffRow=await row.evaluate(e=>{const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,t:e.innerText.replace(/\s+/g,' ').slice(0,80)};});
 const pen=await row.$('[data-test-id=staff_edit_button]'); log.pen=await pen.evaluate(e=>{const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height};}); await p.screenshot({path:'/tmp/qa11310/ex21/b1-staff.png'});
 await pen.click(); await p.waitForTimeout(2500); log.tog0=await R('[data-test-id=toggle_time_clock]'); log.dialog=await R('.q-dialog .q-card'); log.save=await R('[data-test-id=button_save_staff]');
 await p.click('[data-test-id=toggle_time_clock]'); await p.waitForTimeout(800); log.togOn=await p.getAttribute('[data-test-id=toggle_time_clock]','aria-checked'); await p.screenshot({path:'/tmp/qa11310/ex21/b2-timeclock-off.png'});
 await p.click('[data-test-id=button_save_staff]'); await p.waitForTimeout(2500);
 log.clock=(await s.api('/api/staff?limit=100&search=Wes%20Hover')).json.data.collection.find(x=>x.staff_id===W)?.clockable;
 // AFTER: board, tech, list
 await s.go('/workorders?tab=all&search=QA1019'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3500);
 log.after=await colRect('Wes Hover'); log.unassigned=await R('[data-test-id=board_column_header_unassigned]'); await p.mouse.move(700,880); await p.screenshot({path:'/tmp/qa11310/ex21/b3-board-off.png'});
 // drop the unassigned Zeta card onto Wes's column (should be refused with the message)
 const zc=await p.evaluate(n=>{const c=[...document.querySelectorAll('.board-card')].find(e=>e.innerText.includes(n)); const r=c.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+40};},log.wo.Z.n); const tc={x:log.after.panel.x+log.after.panel.w/2,y:log.after.cards[0].y+60};
 await p.mouse.move(zc.x,zc.y,{steps:8}); await p.mouse.down(); for(const d of [3,6,9,12]){ await p.mouse.move(zc.x+d,zc.y+d); await p.waitForTimeout(40);} for(let i=1;i<=24;i++){ await p.mouse.move(zc.x+(tc.x-zc.x)*i/24,zc.y+(tc.y-zc.y)*i/24); await p.waitForTimeout(55);} await p.waitForTimeout(800);
 log.msg=await p.evaluate(()=>{const e=[...document.querySelectorAll('*')].filter(x=>x.children.length<=2&&/can.t be assigned work orders/.test(x.innerText||'')).sort((a,b)=>a.innerText.length-b.innerText.length)[0]; if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,t:e.innerText.trim()};});
 await p.screenshot({path:'/tmp/qa11310/ex21/b4-drop-refused.png'}); await p.mouse.up(); await p.waitForTimeout(2500); log.zLead=(await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=3&search='+log.wo.Z.n)).json.data.work_orders[0].techAssignedLastName||'(none)';
 await toView(p,'list'); await p.waitForTimeout(3000);
 log.list=await p.evaluate(ns=>{const hs=[...document.querySelectorAll('thead th')]; const i=hs.findIndex(h=>/Lead Tech/i.test(h.innerText)); const hr=hs[i].getBoundingClientRect(); return {head:{x:hr.x,y:hr.y,w:hr.width,h:hr.height},rows:[...document.querySelectorAll('tbody tr')].filter(t=>ns.some(n=>t.innerText.includes(n))).map(t=>{const c=t.children[i]; const r=c.getBoundingClientRect(); return {n:ns.find(n=>t.innerText.includes(n)),lead:c.innerText.trim(),x:r.x,y:r.y,w:r.width,h:r.height};})};},[log.wo.A.n,log.wo.M.n,log.wo.Z.n]);
 await p.screenshot({path:'/tmp/qa11310/ex21/b5-list-off.png'});
}catch(e){ log.err=e.message.slice(0,300); }
log.restore=await staff(true);
try{ const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); }catch(e){}
fs.writeFileSync('/tmp/qa11310/ex21/cap18.json',JSON.stringify(log,null,1)); console.log('DONE'); await s.close();
