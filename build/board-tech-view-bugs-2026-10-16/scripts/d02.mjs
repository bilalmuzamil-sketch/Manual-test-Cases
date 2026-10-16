import {session,toView} from './rec.mjs'; import fs from 'fs';
const quick=process.argv[2]||'tech'; const s=await session({quick,vp:{width:1440,height:900},dpr:1}); const p=s.page; const out={quick,mk:await s.marker(),cases:[]};
const get=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const put=async v=>(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status;
const before=await get(); fs.writeFileSync('/tmp/qa11310/pref02-before-'+quick+'.json',JSON.stringify(before,null,1)); out.before={pinned:before.pinnedTechnicianIds,order:(before.technicianOrder||[]).length,collapsed:(before.collapsedGroups||[]).length};
const AB='07253c44-3af0-4164-8a6d-0039dd74034c', AZ='55319163-e4c8-4099-82b2-4f5e9e98c125', AS='b06dd063-d7c6-4aad-9739-48ffd8814c3a'; // Ahtsham Foreman (1 WO), Ahtsham Parts Manger (1), Ahtasham Admin (5)
const nav=[]; p.on('framenavigated',f=>{ if(f===p.mainFrame()) nav.push(f.url()); });
await s.go('/workorders?tab=all'); await p.waitForTimeout(4500); await toView(p,'tech_view'); await p.waitForSelector('[data-test-id^=button_tech_view_pin_]',{timeout:30000}); await p.waitForTimeout(1500);
const lab=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'); if(/Collapse/.test(lab)){await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(1500);} 
for(const id of [AB,AZ]){ const ic=await p.evaluate(id=>document.querySelector(`[data-test-id=button_tech_view_pin_${id}] svg`)?.getAttribute('data-icon'),id); if(ic==='pin'){ await p.click(`[data-test-id=button_tech_view_pin_${id}]`); await p.waitForTimeout(1500);} }
for(const id of [AB,AZ,AS]){ await p.click(`[data-test-id=button_tech_view_group_toggle_${id}]`); await p.waitForTimeout(1500);} await p.mouse.move(1430,890); await p.waitForTimeout(800);
const heads=()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=button_tech_view_group_toggle_]')].map(b=>({id:b.getAttribute('data-test-id').slice(31),y:Math.round(b.getBoundingClientRect().y),name:document.querySelector(`[data-test-id=tech_view_group_name_${b.getAttribute('data-test-id').slice(31)}]`)?.innerText.trim(),pin:document.querySelector(`[data-test-id=button_tech_view_pin_${b.getAttribute('data-test-id').slice(31)}] svg`)?.getAttribute('data-icon')})).sort((a,b)=>a.y-b.y).slice(0,8));
const rowIn=(gid,k=1)=>p.evaluate(([gid,k])=>{const hs=[...document.querySelectorAll('[data-test-id^=button_tech_view_group_toggle_]')].map(b=>({id:b.getAttribute('data-test-id').slice(31),y:b.getBoundingClientRect().y})).sort((a,b)=>a.y-b.y); const i=hs.findIndex(h=>h.id===gid); const y0=hs[i].y, y1=hs[i+1]?hs[i+1].y:1e9; const rows=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].filter(r=>/^tech_view_row_[0-9a-f-]{36}$/.test(r.getAttribute('data-test-id'))).map(r=>({id:r.getAttribute('data-test-id').slice(14),num:r.querySelector('a')?.innerText.trim(),b:r.getBoundingClientRect()})).filter(r=>r.b.y>y0&&r.b.y<y1&&r.b.y<860); const r=rows[Math.min(k,rows.length-1)]; return r?{num:r.num,x:500,y:r.b.y+r.b.height/2}:null;},[gid,k]);
const drag=async(fromSel,to,tag,useName=false)=>{ const g=useName?await p.locator(`[data-test-id=tech_view_group_name_${fromSel}]`).boundingBox():await p.locator(`[data-test-id=tech_view_group_drag_handle_${fromSel}]`).boundingBox(); const fx=g.x+g.width/2, fy=g.y+g.height/2; const n0=nav.length; const u0=p.url();
 await p.mouse.move(fx,fy); await p.mouse.down(); for(let i=1;i<=30;i++){ await p.mouse.move(fx+(to.x-fx)*i/30,fy+(to.y-fy)*i/30); await p.waitForTimeout(40);} await p.waitForTimeout(300); await p.screenshot({path:`/tmp/qa11310/d02-${tag}-hold.png`}); await p.mouse.up(); await p.waitForTimeout(2500);
 const r={tag,from:fromSel,useName,releasedOver:to.num,urlBefore:u0,urlAfter:p.url(),navigations:nav.slice(n0),opened:/\/workorders\/[0-9a-f-]{36}/.test(p.url()),heads:await heads(),dialogs:await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.slice(0,80)))}; out.cases.push(r); console.log(tag,'opened',r.opened,'over',to.num,'order',r.heads.map(h=>h.name+(h.pin==='pin-off'?'*':'')).join(' > ')); await p.screenshot({path:`/tmp/qa11310/d02-${tag}-after.png`});
 if(r.opened){ await p.goBack(); await p.waitForTimeout(3000);} };
try {
out.h0=await heads(); console.log('start',out.h0.map(h=>h.name+(h.pin==='pin-off'?'*':'')).join(' > '));
// A: pinned AB grip -> over a row of AZ (pinned area), downward
let t=await rowIn(AZ,0); await drag(AB,t,'A-pinned-to-pinned-row');
// B: pinned (first pinned now) grip -> over a row of Admin ShopView (unpinned)
let first=(await heads()).find(h=>h.pin==='pin-off'); t=await rowIn(AS,2); await drag(first.id,t,'B-pinned-to-unpinned-row');
// C: pinned header by its NAME -> over a row of the other pinned group, upward
let hs=await heads(); let pins=hs.filter(h=>h.pin==='pin-off'); t=await rowIn(pins[0].id,0); await drag(pins[1].id,t,'C-pinned-name-upward',true);
// D: unpinned Admin ShopView grip -> over a row of first pinned group
hs=await heads(); pins=hs.filter(h=>h.pin==='pin-off'); t=await rowIn(pins[0].id,0); await drag(AS,t,'D-unpinned-to-row');
// E: plain click on a row opens
t=await rowIn((await heads()).find(h=>h.pin==='pin-off').id,0); await p.mouse.click(t.x,t.y); await p.waitForTimeout(3000); out.click={num:t.num,url:p.url()}; console.log('click',t.num,p.url());
} catch(e){ console.log('ERR',e.message); }
// restore prefs (only keys this script changed)
const cur=await get(); out.putR=await put({...cur,pinnedTechnicianIds:before.pinnedTechnicianIds,technicianOrder:before.technicianOrder,collapsedGroups:before.collapsedGroups});
const aft=await get(); out.restored={pinned:JSON.stringify(aft.pinnedTechnicianIds)===JSON.stringify(before.pinnedTechnicianIds),order:JSON.stringify(aft.technicianOrder)===JSON.stringify(before.technicianOrder),collapsed:JSON.stringify(aft.collapsedGroups)===JSON.stringify(before.collapsedGroups)}; console.log('restored',JSON.stringify(out.restored));
fs.writeFileSync('/tmp/qa11310/d02-'+quick+'.json',JSON.stringify(out,null,1)); await s.close();
