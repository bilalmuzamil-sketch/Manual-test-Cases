import {session,toView} from './rec.mjs'; import fs from 'fs';
const quick=process.argv[2]||'tech'; const s=await session({quick,vp:{width:1440,height:900},dpr:1}); const p=s.page; const out={quick,mk:await s.marker(),steps:[]};
const get=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const put=async v=>(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status;
const before=await get();
const snap=()=>p.evaluate(()=>{const th=document.querySelector('[data-test-id=table_tech_view] thead').getBoundingClientRect(); const held=[...document.querySelectorAll('[data-test-id=tech_view_sticky_group]')].filter(e=>{const r=e.getBoundingClientRect(); return r.height>0&&getComputedStyle(e).visibility!=='hidden'&&getComputedStyle(e).display!=='none';}).map(e=>{const r=e.getBoundingClientRect(); const clip=e.closest('.tech-view__held')?.getBoundingClientRect(); return {name:e.innerText.replace(/\s+/g,' ').trim().slice(0,30),top:+r.top.toFixed(1),bottom:+r.bottom.toFixed(1),clipTop:clip?+clip.top.toFixed(1):null,clipBottom:clip?+clip.bottom.toFixed(1):null};});
 const heads=[...document.querySelectorAll('[data-test-id^=button_tech_view_group_toggle_]')].map(b=>{const tr=b.closest('tr')||b; const r=tr.getBoundingClientRect(); return {name:tr.innerText.replace(/\s+/g,' ').trim().slice(0,22),top:+r.top.toFixed(1),bottom:+r.bottom.toFixed(1)};}).filter(h=>h.bottom>0&&h.top<900);
 return {sy:Math.round(scrollY),theadBottom:+th.bottom.toFixed(1),theadTop:+th.top.toFixed(1),held,heads:heads.slice(0,4)};});
try{
 await s.go('/workorders?tab=all&search=ZZAUTOTEST%20F1'); await p.waitForTimeout(4500); await toView(p,'tech_view'); await p.waitForTimeout(2000);
 const lab=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'); if(/Expand/.test(lab)){ await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(3000);} 
 await p.mouse.move(700,600);
 for(let i=0;i<120;i++){ const sn=await snap(); out.steps.push(sn); await p.mouse.wheel(0,25); await p.waitForTimeout(120); }
 for(let i=0;i<120;i++){ await p.mouse.wheel(0,-25); await p.waitForTimeout(120); const sn=await snap(); sn.dir='up'; out.steps.push(sn); }
}catch(e){ out.err=e.message.slice(0,300); }
const cur=await get(); out.put=await put({...cur,collapsedGroups:before.collapsedGroups}); out.restored=JSON.stringify((await get()).collapsedGroups)===JSON.stringify(before.collapsedGroups);
fs.writeFileSync(`/tmp/qa11310/sh06-${quick}.json`,JSON.stringify(out,null,1));
const st=out.steps; console.log('steps',st.length,'err',out.err,'restored',out.restored); console.log('maxHeld',Math.max(...st.map(x=>x.held.length)));
for(const x of st.filter((x,i)=>i%6===0).slice(0,40)) console.log(x.dir||'dn',x.sy,'thB',x.theadBottom,'held',JSON.stringify(x.held.map(h=>h.name.slice(0,14)+'@'+h.top+'-'+h.bottom+(h.clipTop!==null?' clip'+h.clipTop+'-'+h.clipBottom:''))),'next',JSON.stringify(x.heads.map(h=>h.name.slice(0,12)+'@'+h.top)));
await s.close();
