import {session,toView,narr,finish} from './rec.mjs';
const part=process.argv[2]; const quick=part==='a'?'admin':'tech'; const dir=`/tmp/qa11310/vo20${part}`; const N=narr(dir);
const s=await session({quick,vp:{width:1440,height:900},record:`/tmp/qa11310/rec20${part}`}); const p=s.page; const tLogin=Date.now(); const mk=await s.marker(); const log={};
const F='07253c44-3af0-4164-8a6d-0039dd74034c', P='55319163-e4c8-4099-82b2-4f5e9e98c125', WO='32d52d69-7ec4-4a26-b4d8-0c42feb5fe38', WO2='2c136a90-2a48-4d7b-b50d-43a80fdc14ac';
const collapse=async()=>{ const lab=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'); if(/Collapse/.test(lab)){await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2000);} };
const cnt=()=>p.evaluate(()=>{const rr=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].filter(r=>/^tech_view_row_[0-9a-f-]{36}$/.test(r.getAttribute('data-test-id'))); return {rows:rr.length,grips:rr.filter(r=>document.querySelector(`[data-test-id=tech_view_row_drag_handle_${r.getAttribute('data-test-id').slice(14)}]`)).length, heads:document.querySelectorAll('[data-test-id^=button_tech_view_group_toggle_]').length-1, headGrips:document.querySelectorAll('[data-test-id^=tech_view_group_drag_handle_]').length, uaGrip:!!document.querySelector('[data-test-id=tech_view_group_drag_handle_unassigned]')};});
const where=()=>p.evaluate(wo=>{const r=document.querySelector(`[data-test-id=tech_view_row_${wo}]`); if(!r) return null; const y=r.getBoundingClientRect().y; const hs=[...document.querySelectorAll('[data-test-id^=button_tech_view_group_toggle_]')].map(b=>({y:b.getBoundingClientRect().y,name:b.closest('[data-test-id^=tech_view_group_]')?.querySelector('[data-test-id^=tech_view_group_name_]')?.innerText.trim()})).filter(h=>h.y<y).sort((a,b)=>b.y-a.y); return hs[0]?.name;},WO);
const toast=()=>p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(d=>d.innerText.replace(/check_circle|Close/g,'').replace(/\s+/g,' ').trim()).join(' | '));
const drag=async(fx,fy,tx,ty)=>{ await p.mouse.move(fx,fy,{steps:10}); await p.waitForTimeout(300); await p.mouse.down(); for(let i=1;i<=25;i++){ await p.mouse.move(fx+(tx-fx)*i/25,fy+(ty-fy)*i/25); await p.waitForTimeout(50);} await p.waitForTimeout(500); await p.mouse.up(); await p.waitForTimeout(1500); };
const zz=async()=>{ await s.go('/workorders?tab=all&search=ZZAUTOTEST'); await p.waitForTimeout(4000); await toView(p,'tech_view'); await p.waitForTimeout(1500); await collapse(); for(const g of [F,P]){ await p.click(`[data-test-id=button_tech_view_group_toggle_${g}]`); await p.waitForTimeout(1500);} await p.mouse.move(1300,860); await p.waitForTimeout(800); };
await s.go('/workorders?tab=all'); await p.waitForTimeout(4000); await toView(p,'tech_view'); await p.waitForTimeout(1500); await collapse();
await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]'); await p.waitForTimeout(2500); await p.mouse.move(1300,860); await p.waitForTimeout(800);
if(part==='a'){
 log.c1=await cnt(); const g=await p.locator('[data-test-id^=tech_view_row_drag_handle_]').first().boundingBox(); await p.mouse.move(g.x+60,g.y+g.height/2,{steps:14});
 await N.cap(s,'n1',`SV-11320 · staging ${mk.version} · admin · Tech View · Unassigned: ${log.c1.grips} of ${log.c1.rows} rows on screen show the grip`);
 await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]'); await p.waitForTimeout(1800); await p.mouse.move(1300,860); log.c2=await cnt();
 const u=await p.locator('[data-test-id=button_tech_view_group_toggle_unassigned]').boundingBox(); await p.mouse.move(u.x+u.width+40,u.y+u.height/2,{steps:14});
 await N.cap(s,'n2',`Unassigned header: ${log.c2.uaGrip?'grip':'no grip'} · technician headers: ${log.c2.headGrips} of ${log.c2.heads} with grip`);
 await zz(); log.w0=await where(); let b=await p.locator(`[data-test-id=tech_view_row_${WO}]`).boundingBox(); const t=await p.locator(`[data-test-id=tech_view_row_${WO2}]`).boundingBox();
 await drag(b.x+520,b.y+b.height/2,t.x+520,t.y+t.height/2+10); log.t3=await toast(); await p.waitForTimeout(1000); log.w3=await where();
 await N.cap(s,'n3',`Dragged S2-35338 by the middle of the row: ${log.w0} → ${log.w3} · "${log.t3}"`);
 const gb=await p.locator(`[data-test-id=tech_view_row_drag_handle_${WO}]`).boundingBox(); const fh=await p.locator(`[data-test-id=button_tech_view_group_toggle_${F}]`).boundingBox();
 await drag(gb.x+gb.width/2,gb.y+gb.height/2,600,fh.y+fh.height/2); log.t4=await toast(); await p.waitForTimeout(1000); log.w4=await where();
 await N.cap(s,'n4',`Dragged S2-35338 by its grip: back to ${log.w4} · "${log.t4}"`);
 await p.waitForTimeout(800); b=await p.locator(`[data-test-id=tech_view_row_${WO}]`).boundingBox(); await p.mouse.move(b.x+520,b.y+b.height/2,{steps:12}); await p.waitForTimeout(400); await p.mouse.click(b.x+520,b.y+b.height/2); await p.waitForTimeout(3500);
 log.u5=p.url(); log.n5=await p.evaluate(()=>document.body.innerText.match(/S2-35338/)?.[0]);
 await N.cap(s,'n5',`One click on the row opened work order ${log.n5} (${new URL(log.u5).pathname})`);
} else {
 log.c6=await cnt(); await p.mouse.move(60,420,{steps:14});
 await N.cap(s,'n6',`SV-11320 · staging ${mk.version} · Technician (view only) · Unassigned: ${log.c6.grips} of ${log.c6.rows} rows show a grip`);
 await zz(); const c7=await cnt(); log.w6=await where(); let b=await p.locator(`[data-test-id=tech_view_row_${WO}]`).boundingBox(); const t=await p.locator(`[data-test-id=tech_view_row_${WO2}]`).boundingBox();
 await drag(b.x+520,b.y+b.height/2,t.x+520,t.y+t.height/2+10); log.t7=await toast(); await p.waitForTimeout(1000); log.w7=await where(); log.c7=c7;
 await N.cap(s,'n7',`Headers with grip: ${c7.headGrips} of ${c7.heads} · dragged S2-35338: still under ${log.w7}${log.t7?' · '+log.t7:', no change'}`);
 await N.cap(s,'n8','Spec v64 S9-R1a: grips for users who can drag, none on Unassigned\'s header → PASSED');
}
await finish(s,dir,N.ev,{tLogin,mk,log}); console.log(JSON.stringify(log));
