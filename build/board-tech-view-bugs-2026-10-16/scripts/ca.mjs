import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'tech',vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={mk:await s.marker()};
const get=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const put=async v=>(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status;
const before=await get(); fs.writeFileSync('/tmp/qa11310/pref-ca-tech.json',JSON.stringify(before,null,1));
const st=()=>p.evaluate(()=>{const t=[...document.querySelectorAll('[data-test-id^=button_tech_view_group_toggle_]')]; return {label:document.querySelector('[data-test-id=button_tech_view_collapse_all]')?.getAttribute('aria-label'),groups:t.length,open:t.filter(b=>b.getAttribute('aria-expanded')==='true').length,url:location.search};});
try{
 await s.go('/workorders?tab=all'); await p.waitForTimeout(4500); await toView(p,'tech_view'); await p.waitForTimeout(2500);
 out.s0=await st();
 if(/Collapse/.test(out.s0.label)){ await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);} out.s1=await st(); await p.screenshot({path:'/tmp/qa11310/ca-1-nosearch.png'});
 out.pref1=(await get()).collapsedGroups.length;
 await p.click('[data-test-id=page_search_toggle]'); await p.waitForTimeout(600); await p.keyboard.type('S2-3677',{delay:80}); await p.waitForTimeout(3500); out.s2=await st(); await p.mouse.move(5,890); await p.waitForTimeout(500); await p.screenshot({path:'/tmp/qa11310/ca-2-search.png'});
 await s.go('/workorders?tab=all&search=S2-3677'); await p.waitForTimeout(4500); out.s3=await st();
 await s.go('/workorders?tab=all'); await p.waitForTimeout(4500); out.s4=await st();
 for(const q of ['ZZAUTOTEST','4 Star','S2-35338']){ await s.go('/workorders?tab=all&search='+encodeURIComponent(q)); await p.waitForTimeout(4000); out['q_'+q]=await st(); }
}catch(e){ out.err=e.message.slice(0,200); }
const cur=await get(); out.put=await put({...cur,collapsedGroups:before.collapsedGroups,pinnedTechnicianIds:before.pinnedTechnicianIds,technicianOrder:before.technicianOrder}); const a=await get(); out.restored=JSON.stringify(a.collapsedGroups)===JSON.stringify(before.collapsedGroups);
console.log(JSON.stringify(out,null,0)); fs.writeFileSync('/tmp/qa11310/ca.json',JSON.stringify(out,null,1)); await s.close();
