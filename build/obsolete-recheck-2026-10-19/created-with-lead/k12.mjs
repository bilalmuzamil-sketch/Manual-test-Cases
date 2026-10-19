// New case (created with lead keeps initial sort): Owen Created QA1019; Zeta S2-37442 already made from Schedule; make Alpha, Mid, Mid the same way, then read List / Tech / Board
import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:2100},dpr:2}); const p=s.page; const log={mk:await s.marker(),created:[{n:'S2-37442',c:'Zeta Hauling QA1019',via:'schedule (k11d)'}]};
const OWN=['display','tab','density','collapsedGroups','sortBy','descending']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const click=async sel=>{const b=await p.locator(sel).first().boundingBox(); await p.mouse.click(b.x+b.width/2,b.y+b.height/2); await p.waitForTimeout(1200);};
const pick=async(sel,txt)=>{ await click(sel); await p.keyboard.type(txt,{delay:40}); await p.waitForTimeout(2500); const o=await p.evaluateHandle(t=>[...document.querySelectorAll('.q-menu .q-item')].find(e=>e.innerText.includes(t)),txt); const e=o.asElement(); if(!e) throw new Error('no option '+txt); const b=await e.boundingBox(); await p.mouse.click(b.x+b.width/2,b.y+b.height/2); await p.waitForTimeout(1500); };
try{
 for(const [cust,unit] of [['Alpha Freight QA1019','A-1019'],['Mid Trucking QA1019','M-1019'],['Mid Trucking QA1019','M-1019']]){
  await s.go('/schedule'); await p.waitForTimeout(6000);
  const row=await p.evaluateHandle(()=>{const el=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&/Owen Created QA1019/.test(e.textContent)); el.scrollIntoView({block:'center'}); return el;}); await p.waitForTimeout(1500);
  const rb=await row.asElement().boundingBox(); let ok=false;
  for(const dx of [700,820,940,1060,560]){ await p.keyboard.press('Escape'); await p.waitForTimeout(500); await p.mouse.click(rb.x+dx,rb.y+rb.height/2); await p.waitForTimeout(1200); if(await p.locator('[data-test-id=menu_schedule_new_work_order]').count()){ ok=true; break; } }
  if(!ok) throw new Error('no cell menu'); await click('[data-test-id=menu_schedule_new_work_order]'); await p.waitForTimeout(1500);
  await pick('[data-test-id=select_customer_select]',cust); await pick('[data-test-id=select_company_vehicle_select]',unit);
  const resP=p.waitForResponse(r=>r.url().includes('/api/work-orders/create'),{timeout:20000}); await click('[data-test-id=button_save_work_order]'); const res=await resP; const id=(await res.json()).data.work_order_id;
  const w=(await s.api('/api/work-orders/view/'+id)).json.data.work_order; log.created.push({n:String(w.number).replace(/^S-/,'S2-'),c:cust,lead:w.technician_last_name,start:w.start_date||w.scheduled_start}); await p.waitForTimeout(4000); }
 for(let i=0;i<30;i++){ const w=(await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=50&search=QA1019')).json.data.work_orders.map(x=>x.number); if(log.created.every(o=>w.includes(o.n))){log.indexed=i*3;break;} await p.waitForTimeout(3000); }
 { const cur=await getP(); const v={...cur}; delete v.sortBy; delete v.descending; v.display='list'; v.tab='all'; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); }
 await s.go('/workorders?tab=all&search=QA1019'); await p.waitForTimeout(3500); await toView(p,'list'); await p.waitForTimeout(3500);
 log.list=await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>{const t=r.innerText; const b=r.getBoundingClientRect(); return {t:(t.match(/S\d*-\d+/)||[''])[0]+' '+((t.match(/(Zeta|Alpha|Mid)[^\t\n]*/)||[''])[0]).slice(0,22)+' | '+((t.match(/Owen Created[^\t\n]*/)||[''])[0]),y:b.y,h:b.height};}).filter(x=>x.t.trim().length>3));
 await p.screenshot({path:'/tmp/qa11310/ex27/k12-list.png'});
 await toView(p,'tech_view'); await p.waitForTimeout(3500);
 for(let i=0;i<150;i++){ const ok=await p.evaluate(()=>{const g=[...document.querySelectorAll('[data-test-id^=tech_view_group_name_]')].find(e=>/Owen Created/.test(e.innerText)); if(g){ g.scrollIntoView({block:'start'}); return true;} const m=document.querySelector('.q-table__middle'); m.scrollTop+=500; return false;}); if(ok) break; await p.waitForTimeout(300); }
 await p.waitForTimeout(1500); log.tech=await p.evaluate(()=>{ const rows=[...document.querySelectorAll('tbody tr')]; const gi=rows.findIndex(r=>/Owen Created/.test(r.innerText)&&r.querySelector('[data-test-id^=tech_view_group_name_]')); const out=[]; for(let i=gi+1;i<rows.length;i++){ if(rows[i].querySelector('[data-test-id^=tech_view_group_name_]')) break; const t=rows[i].innerText; const n=(t.match(/S\d*-\d+/)||[])[0]; const b=rows[i].getBoundingClientRect(); if(n) out.push({t:n+' '+(t.match(/(Zeta|Alpha|Mid)[^\n]*/)||[''])[0].slice(0,30),y:b.y,h:b.height}); } const gh=rows[gi].getBoundingClientRect(); return {gy:gh.y,rows:out}; });
 await p.screenshot({path:'/tmp/qa11310/ex27/k12-tech.png'});
 await toView(p,'board_view'); await p.waitForTimeout(3500);
 for(let i=0;i<120;i++){ const ok=await p.evaluate(()=>{const h=[...document.querySelectorAll('[data-test-id^=board_column_header_]')].find(e=>/Owen Created/.test(e.innerText)); if(h){ h.scrollIntoView({inline:'center',block:'nearest'}); return true;} document.querySelector('[data-test-id=board_view_scroller]').scrollLeft+=900; return false;}); if(ok) break; await p.waitForTimeout(300); }
 await p.waitForTimeout(1500); log.board=await p.evaluate(()=>{const h=[...document.querySelectorAll('[data-test-id^=board_column_header_]')].find(e=>/Owen Created/.test(e.innerText)); const pn=h.closest('.board-column__panel'); return [...pn.querySelectorAll('.board-card')].map(c=>{const t=c.innerText; const b=c.getBoundingClientRect(); return {t:(t.match(/S\d*-\d+/)||[])[0]+' '+((t.match(/(Zeta|Alpha|Mid)[^\n]*/)||[''])[0]).slice(0,25),x:b.x,y:b.y,w:b.width,h:b.height};});});
 await p.screenshot({path:'/tmp/qa11310/ex27/k12-board.png'});
}catch(e){ log.err=e.message.slice(0,300); }
try{ const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); }catch(e){}
fs.writeFileSync('/tmp/qa11310/ex27/k12.json',JSON.stringify(log,null,1)); console.log('DONE'); await s.close();
