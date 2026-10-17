import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'admin',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker()};
const OWN=['display','collapsedGroups','tab']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const ESTHER='b669608e-a897-4f21-a510-8ced9d9fa982';
const wo=async n=>{ const w=(await s.api('/api/work-orders?pagination[page]=1&pagination[rowsPerPage]=3&search='+n)).json.data.work_orders[0]; return {id:w.id,status:w.status,lead:w.techAssignedId,name:((w.techAssignedFirstName||'')+' '+(w.techAssignedLastName||'')).trim()}; };
const R=sel=>p.evaluate(sel=>{const e=document.querySelector(sel); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height,text:e.innerText.replace(/\s+/g,' ').trim().slice(0,80)};},sel);
const menuOf=async(q,n)=>{ await s.go('/workorders?tab=all&search='+encodeURIComponent(q)); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3000);
 for(let i=0;i<60;i++){ if(await p.evaluate(n=>[...document.querySelectorAll('.board-card')].some(c=>c.innerText.includes(n)&&c.getBoundingClientRect().right<1440&&c.getBoundingClientRect().left>0),n)) break; await p.evaluate(()=>{document.querySelector('[data-test-id=board_view_scroller]').scrollLeft+=600;}); await p.waitForTimeout(400);}
 const b=await p.evaluate(n=>{const c=[...document.querySelectorAll('.board-card')].find(c=>c.innerText.includes(n)); const r=c.getBoundingClientRect(); const m=c.querySelector('[data-test-id=button_work_order_more_actions]').getBoundingClientRect(); return {cx:r.x+r.width/2,cy:r.y+40,mx:m.x+m.width/2,my:m.y+m.height/2,card:{x:r.x,y:r.y,w:r.width,h:r.height}};},n);
 await p.mouse.move(b.cx,b.cy); await p.waitForTimeout(500); await p.mouse.click(b.mx,b.my); await p.waitForTimeout(1200);
 const items=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=menu_item_]')].filter(e=>e.getBoundingClientRect().height>0).map(e=>{const r=e.getBoundingClientRect(); return {tid:e.dataset.testId,text:e.innerText.trim(),disabled:e.getAttribute('aria-disabled')==='true'||e.classList.contains('disabled'),color:getComputedStyle(e).color,x:r.x,y:r.y,w:r.width,h:r.height};}));
 return {card:b.card,items}; };
try{
 out.w0=await wo('S2-35490'); console.log('before',JSON.stringify(out.w0));
 out.menu=await menuOf('ZZAUTOTEST F1 Prompt Where','S2-35490'); await p.screenshot({path:'/tmp/qa11310/ex/x19-1-menu.png'}); console.log('menu',JSON.stringify(out.menu.items.map(i=>[i.text,i.disabled,i.color])));
 await p.click('[data-test-id=menu_item_unassign_lead_technician]'); await p.waitForTimeout(1500); out.dlg=await R('.q-dialog .q-card'); await p.screenshot({path:'/tmp/qa11310/ex/x19-2-prompt.png'}); console.log('dlg',JSON.stringify(out.dlg));
 await p.click('[data-test-id=button_clear_shifts_keep]'); await p.waitForTimeout(1200); out.toast=await R('.q-notification'); await p.screenshot({path:'/tmp/qa11310/ex/x19-3-toast.png'}); console.log('toast',JSON.stringify(out.toast));
 await p.waitForTimeout(2500); out.w1=await wo('S2-35490'); out.unCol=await p.evaluate(()=>{const pan=[...document.querySelectorAll('.board-column__panel')].find(x=>/Unassigned/.test(x.querySelector('[data-test-id^=board_column_header_]')?.innerText||'')); const c=[...pan.querySelectorAll('.board-card')].find(c=>c.innerText.includes('S2-35490')); const r=(c||pan).getBoundingClientRect(); return {found:!!c,x:r.x,y:r.y,w:r.width,h:r.height,col:pan.getBoundingClientRect().x};}); await p.mouse.move(1435,895); await p.screenshot({path:'/tmp/qa11310/ex/x19-4-after.png'}); console.log('after',JSON.stringify(out.w1),JSON.stringify(out.unCol));
 // restore lead via the API the board uses
 const r=await s.api(`/api/work-orders/${out.w0.id}/board-move`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({technicianId:ESTHER})}); out.restore=[r.status,(await wo('S2-35490')).name]; console.log('restore',out.restore);
 out.paid=await menuOf('S2-15322','S2-15322'); await p.screenshot({path:'/tmp/qa11310/ex/x19-5-paid.png'}); console.log('paid',JSON.stringify(out.paid.items.map(i=>[i.text,i.disabled,i.color]))); await p.keyboard.press('Escape');
 out.nolead=await menuOf('S2-17495','S2-17495'); await p.screenshot({path:'/tmp/qa11310/ex/x19-6-nolead.png'}); console.log('nolead',JSON.stringify(out.nolead.items.map(i=>[i.text,i.disabled]))); await p.keyboard.press('Escape');
}catch(e){ out.err=e.message.slice(0,300); console.log('ERR',out.err); }
const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})});
fs.writeFileSync('/tmp/qa11310/ex/x19.json',JSON.stringify(out,null,1)); await s.close();
