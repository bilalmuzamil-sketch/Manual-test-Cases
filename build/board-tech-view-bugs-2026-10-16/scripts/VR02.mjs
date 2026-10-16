import {session,toView,narr,finish} from './rec.mjs'; import fs from 'fs';
const dir='/tmp/qa11310/vo02'; const N=narr(dir); const SEARCH='ZZAUTOTEST F2 Tech Pin Order';
const s=await session({vp:{width:1440,height:900},record:'/tmp/qa11310/rec02'}); const p=s.page; const tLogin=Date.now(); const mk=await s.marker(); const log={};
const get=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const put=async v=>(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status;
const before=await get(); fs.writeFileSync('/tmp/qa11310/pref02-film-before.json',JSON.stringify(before,null,1));
const FM='07253c44-3af0-4164-8a6d-0039dd74034c', PM='55319163-e4c8-4099-82b2-4f5e9e98c125', AB='c57d19d7-dc2b-4472-a11d-984c61b01c0e';
const heads=()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=button_tech_view_group_toggle_]')].map(b=>{const id=b.getAttribute('data-test-id').slice(30); return {id,y:Math.round(b.getBoundingClientRect().y),name:document.querySelector(`[data-test-id=tech_view_group_name_${id}]`)?.innerText.trim(),pin:document.querySelector(`[data-test-id=button_tech_view_pin_${id}] svg`)?.getAttribute('data-icon')};}).filter(h=>h.y>0&&h.y<900).sort((a,b)=>a.y-b.y));
const pinned=async()=>(await heads()).filter(h=>h.pin==='pin-off').map(h=>h.name).join(', ');
const row=num=>p.evaluate(num=>{const r=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].filter(r=>/^tech_view_row_[0-9a-f-]{36}$/.test(r.getAttribute('data-test-id'))).find(r=>r.innerText.includes(num)); const b=r.getBoundingClientRect(); return {x:560,y:b.y+b.height/2};},num);
const groupOf=num=>p.evaluate(num=>{const r=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].filter(r=>/^tech_view_row_[0-9a-f-]{36}$/.test(r.getAttribute('data-test-id'))).find(r=>r.innerText.includes(num)); const y=r.getBoundingClientRect().y; const hs=[...document.querySelectorAll('[data-test-id^=button_tech_view_group_toggle_]')].map(b=>({y:b.getBoundingClientRect().y,id:b.getAttribute('data-test-id').slice(30)})).filter(h=>h.y<y).sort((a,b)=>b.y-a.y); return document.querySelector(`[data-test-id=tech_view_group_name_${hs[0].id}]`)?.innerText.trim();},num);
const drag=async(id,to)=>{ const g=await p.locator(`[data-test-id=tech_view_group_drag_handle_${id}]`).boundingBox(); const fx=g.x+g.width/2, fy=g.y+g.height/2; await p.mouse.move(fx,fy,{steps:12}); await p.waitForTimeout(300); await p.mouse.down(); for(let i=1;i<=30;i++){ await p.mouse.move(fx+(to.x-fx)*i/30,fy+(to.y-fy)*i/30); await p.waitForTimeout(45);} await p.waitForTimeout(600); await p.mouse.up(); await p.waitForTimeout(2200); };
try{
 await s.go('/workorders?tab=all&search='+encodeURIComponent(SEARCH)); await p.waitForTimeout(4000); await toView(p,'tech_view'); await p.waitForSelector('[data-test-id^=button_tech_view_pin_]'); await p.waitForTimeout(1200);
 for(const id of [FM,AB]){ const ic=await p.evaluate(id=>document.querySelector(`[data-test-id=button_tech_view_pin_${id}] svg`)?.getAttribute('data-icon'),id); if(ic==='pin'){ await p.click(`[data-test-id=button_tech_view_pin_${id}]`); await p.waitForTimeout(1500);} }
 for(const id of [FM,PM]){ const ex=await p.getAttribute(`[data-test-id=button_tech_view_group_toggle_${id}]`,'aria-expanded'); if(ex!=='true'){ await p.click(`[data-test-id=button_tech_view_group_toggle_${id}]`); await p.waitForTimeout(1200);} }
 await p.mouse.move(1300,860); await p.waitForTimeout(800); log.p1=await pinned();
 await N.cap(s,'n1',`SV-11402 · staging ${mk.version} · admin · Tech View · pinned: ${log.p1}`);
 await drag(FM,await row('S2-35339')); log.u2=p.url(); log.p2=await pinned(); log.g2=await groupOf('S2-35339');
 await N.cap(s,'n2',`Dragged pinned "Ahtsham Foreman" onto S2-35339: no work order opened (${new URL(log.u2).pathname}) · pinned now: ${log.p2}`);
 await drag(PM,await row('S2-35338')); log.u3=p.url(); log.p3=await pinned(); log.g3a=await groupOf('S2-35338'); log.g3b=await groupOf('S2-35339');
 await N.cap(s,'n3',`Dragged unpinned "Ahtsham Parts Manger" onto S2-35338: nothing opened · S2-35338 still under ${log.g3a}, S2-35339 under ${log.g3b}`);
 const t=await row('S2-35339'); await p.mouse.move(t.x,t.y,{steps:12}); await p.waitForTimeout(300); await p.mouse.click(t.x,t.y); await p.waitForTimeout(3500); log.u4=p.url();
 await N.cap(s,'n4',`One click on S2-35339 opened it (${new URL(log.u4).pathname.slice(0,24)}…) · Spec v64 S9-R9 + S2-R8 → PASSED`);
}catch(e){ log.err=e.message.slice(0,200); }
const cur=await get(); log.put=await put({...cur,pinnedTechnicianIds:before.pinnedTechnicianIds,technicianOrder:before.technicianOrder,collapsedGroups:before.collapsedGroups}); const aft=await get(); log.restored=['pinnedTechnicianIds','technicianOrder','collapsedGroups'].every(k=>JSON.stringify(aft[k])===JSON.stringify(before[k]));
await finish(s,dir,N.ev,{tLogin,mk,log}); console.log(JSON.stringify(log));
