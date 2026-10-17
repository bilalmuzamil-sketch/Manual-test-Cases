import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({quick:'tech',vp:{width:1440,height:900},dpr:1}); const p=s.page; const out={};
const get=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const put=async v=>(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status;
const before=await get(); const W=[]; p.on('request',r=>{ if(/preferences/.test(r.url())&&r.method()==='PUT'){ try{ const v=JSON.parse(r.postData()).value; W.push({t:Date.now(),collapsed:(v.collapsedGroups||[]).length}); }catch(e){} } });
const openNames=()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=button_tech_view_group_toggle_]')].filter(b=>b.getAttribute('aria-expanded')==='true').map(b=>{const id=b.getAttribute('data-test-id').slice(30); return (document.querySelector(`[data-test-id=tech_view_group_name_${id}]`)?.innerText.trim()||id)+' ('+b.closest('[data-test-id^=tech_view_group_]')?.innerText.replace(/\s+/g,' ').match(/(\d+) work order/)?.[1]+')';}));
try{
 await s.go('/workorders?tab=all'); await p.waitForTimeout(4500); await toView(p,'tech_view'); await p.waitForTimeout(2500);
 const lab=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'); if(/Collapse/.test(lab)){ await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);} 
 const g0=await get(); out.allIdsCollapsedBefore=g0.collapsedGroups.length; out.open0=await openNames();
 await p.click('[data-test-id=page_search_toggle]'); await p.waitForTimeout(600); W.length=0; await p.keyboard.type('4 Star',{delay:80}); await p.waitForTimeout(4000);
 out.openAfterSearch=await openNames(); out.label=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'); out.putsDuringSearch=W.slice(); const g1=await get(); out.collapsedNow=g1.collapsedGroups.length; out.removed=g0.collapsedGroups.filter(x=>!g1.collapsedGroups.includes(x));
 await p.screenshot({path:'/tmp/qa11310/ca2-search.png'});
}catch(e){ out.err=e.message.slice(0,200); }
const cur=await get(); out.put=await put({...cur,collapsedGroups:before.collapsedGroups}); out.restored=JSON.stringify((await get()).collapsedGroups)===JSON.stringify(before.collapsedGroups);
console.log(JSON.stringify(out)); fs.writeFileSync('/tmp/qa11310/ca2.json',JSON.stringify(out,null,1)); await s.close();
