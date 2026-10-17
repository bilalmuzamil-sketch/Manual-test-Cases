import {session,toView,narr,finish} from './rec.mjs';
const dir='/tmp/qa11310/vo06'; const N=narr(dir);
const s=await session({quick:'tech',vp:{width:1440,height:900},record:'/tmp/qa11310/rec06'}); const p=s.page; const tLogin=Date.now(); const mk=await s.marker(); const log={};
const get=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const put=async v=>(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status;
const before=await get();
const geo=(target)=>p.evaluate((target)=>{
 const held=[...document.querySelectorAll('[data-test-id=tech_view_sticky_group]')].filter(e=>{const r=e.getBoundingClientRect(); const cs=getComputedStyle(e); return r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none';});
 const heads=[...document.querySelectorAll('[data-test-id^=button_tech_view_group_toggle_]')].map(b=>b.closest('tr'));
 const i=heads.findIndex(tr=>tr.innerText.replace(/\s+/g,' ').startsWith(target));
 const clip=held[0]?.closest('.tech-view__held')?.getBoundingClientRect();
 const r=held[0]?.getBoundingClientRect(); const nx=heads[i+1]?.getBoundingClientRect(); const own=heads[i]?.getBoundingClientRect();
 return {n:held.length,name:held[0]?held[0].innerText.replace(/\s+/g,' ').trim():null,y:r?Math.round(r.top):null,clip:clip?Math.round(clip.top):null,own:own?Math.round(own.top):null,next:nx?Math.round(nx.top):null,nextName:heads[i+1]?heads[i+1].innerText.replace(/\s+/g,' ').trim().split(' ').slice(1,3).join(' '):null};
},target);
const prep=async q=>{ await s.go('/workorders?tab=all&search='+encodeURIComponent(q)); await p.waitForTimeout(4000); await toView(p,'tech_view'); await p.waitForTimeout(2000);
 for(let k=0;k<2;k++){ if(/Expand/.test(await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'))) break; await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);} await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(3000); await p.mouse.move(700,600,{steps:10}); };
const until=async(target,cond,fast,slow=6)=>{ for(let i=0;i<1500;i++){ const g=await geo(target); if(cond(g)) return g; await p.mouse.wheel(0,fast(g)?fast(g):slow); await p.waitForTimeout(fast(g)?90:110);} throw new Error('not reached '+target); };
try{
 await prep('Lamkin'); const T='DH David Haynes';
 let g=await until(T,g=>g.name?.startsWith(T)&&g.own<g.clip-50&&g.next>g.clip+200,g=>g.own===null||g.own>600?90:12,8);
 log.n1=g; await N.cap(s,'n1',`SV-11406 · staging ${mk.version} · Tech View, all groups open · "David Haynes" header held just under the column headings`);
 g=await until(T,g=>g.name?.startsWith(T)&&g.y<=g.clip-20,g=>g.next>g.clip+70?16:0,3); log.n2=g;
 await N.cap(s,'n2',`"Douglas Fields" header reached it and is pushing "David Haynes" up (${g.clip-g.y} px off) · headers held: ${g.n}`);
 g=await until(T,g=>g.name&&!g.name.startsWith(T)&&g.y===g.clip,g=>0,3); log.n3=g;
 await N.cap(s,'n3',`"${g.name.split(' ').slice(1,3).join(' ')}" is now the held header · headers held: ${g.n}`);
 for(let i=0;i<40;i++){ await p.mouse.wheel(0,-3); await p.waitForTimeout(90); const h=await geo(T); if(h.name?.startsWith(T)&&h.y===h.clip&&h.next>h.clip+60) { log.n4=h; break; } }
 await N.cap(s,'n4',`Scrolling back up: "David Haynes" comes back down and is held again · headers held: ${log.n4?.n}`);
 await s.caption('Next: search "4 Star" to check Unassigned, which has 137 work orders',{hold:1800}); await prep('4 Star'); const U='Unassigned';
 g=await until(U,g=>g.name?.startsWith(U)&&g.next!==null&&g.y<=g.clip-20,g=>(g.next===null||g.next>g.clip+400)?600:(g.next>g.clip+70?20:0),3); log.n5=g;
 await N.cap(s,'n5',`Unassigned (137 work orders): the next header pushes it off the same way · headers held: ${g.n} · Spec v64 S2-E1, S2-R18 → PASSED`);
}catch(e){ log.err=e.message.slice(0,200); }
const cur=await get(); log.put=await put({...cur,collapsedGroups:before.collapsedGroups}); log.restored=JSON.stringify((await get()).collapsedGroups)===JSON.stringify(before.collapsedGroups);
await finish(s,dir,N.ev,{tLogin,mk,log}); console.log(JSON.stringify(log));
