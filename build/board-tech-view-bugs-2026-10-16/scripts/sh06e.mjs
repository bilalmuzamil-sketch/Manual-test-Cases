import {session,toView} from './rec.mjs'; import fs from 'fs';
const [quick,search,target]=[process.argv[2],process.argv[3],process.argv[4]]; const tag=process.argv[5];
const s=await session({quick,vp:{width:1440,height:900},dpr:2}); const p=s.page; const out={quick,search,target,mk:await s.marker(),shots:[]};
const get=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const put=async v=>(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status;
const before=await get();
const geo=()=>p.evaluate((target)=>{
 const R=e=>{if(!e)return null; const r=e.getBoundingClientRect(); return {x:+r.x.toFixed(1),y:+r.y.toFixed(1),w:+r.width.toFixed(1),h:+r.height.toFixed(1)};};
 const held=[...document.querySelectorAll('[data-test-id=tech_view_sticky_group]')].filter(e=>{const r=e.getBoundingClientRect(); const cs=getComputedStyle(e); return r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none';});
 const heads=[...document.querySelectorAll('[data-test-id^=button_tech_view_group_toggle_]')].map(b=>b.closest('tr'));
 const i=heads.findIndex(tr=>tr.innerText.replace(/\s+/g,' ').startsWith(target));
 const clip=held[0]?.closest('.tech-view__held');
 // column headings visible at top: any element with text 'Work Order' near the top
 const ths=[...document.querySelectorAll('th, [role=columnheader]')].filter(e=>{const r=e.getBoundingClientRect(); return r.height>0&&r.bottom>0&&r.top<300;}).map(e=>({t:e.innerText.trim().slice(0,20),...R(e)}));
 return {n:held.length,held:held[0]?{name:held[0].innerText.replace(/\s+/g,' ').trim(),...R(held[0])}:null,clip:R(clip),own:heads[i]?{name:heads[i].innerText.replace(/\s+/g,' ').trim(),...R(heads[i])}:null,next:heads[i+1]?{name:heads[i+1].innerText.replace(/\s+/g,' ').trim(),...R(heads[i+1])}:null,ths:ths.slice(0,12)};
},target);
try{
 await s.go('/workorders?tab=all&search='+encodeURIComponent(search)); await p.waitForTimeout(4500); await toView(p,'tech_view'); await p.waitForTimeout(2500);
 for(let k=0;k<2;k++){ if(/Expand/.test(await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'))) break; await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(3000);} await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(3500);
 out.label=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label');
 await p.mouse.move(700,600);
 const want=['held','push','swap']; let stage=0; let g0=null;
 for(let i=0;i<900&&stage<3;i++){
  const g=await geo(); if(i===0) g0=g;
  const heldT=g.held&&g.held.name.startsWith(target);
  if(stage===0&&heldT&&g.own&&g.own.y<g.clip.y-60&&(!g.next||g.next.y>g.clip.y+160)){ await p.waitForTimeout(600); const gg=await geo(); await p.screenshot({path:`ev06/${tag}-1-held.png`}); out.shots.push({k:'held',...gg}); stage=1; }
  else if(stage===1&&heldT&&g.held.y<g.clip.y-14&&g.held.y>g.clip.y-34){ await p.waitForTimeout(600); const gg=await geo(); await p.screenshot({path:`ev06/${tag}-2-push.png`}); out.shots.push({k:'push',...gg}); stage=2; }
  else if(stage===2&&g.held&&!heldT&&Math.abs(g.held.y-g.clip.y)<1&&g.next){ await p.waitForTimeout(600); const gg=await geo(); await p.screenshot({path:`ev06/${tag}-3-swap.png`}); out.shots.push({k:'swap',...gg}); stage=3; }
  const step = ((stage===0 && g.own && g.own.y>700) || (stage===1 && (!g.next || g.next.y>1100))) ? 120 : 8;
  await p.mouse.wheel(0,step); await p.waitForTimeout(step>8?150:140);
 }
 out.stage=stage; out.g0=g0;
}catch(e){ out.err=e.message.slice(0,300); }
const cur=await get(); out.put=await put({...cur,collapsedGroups:before.collapsedGroups}); out.restored=JSON.stringify((await get()).collapsedGroups)===JSON.stringify(before.collapsedGroups);
fs.writeFileSync(`ev06/${tag}.json`,JSON.stringify(out,null,1));
console.log(JSON.stringify({err:out.err,stage:out.stage,label:out.label,restored:out.restored,mk:out.mk}));
for(const x of out.shots) console.log(x.k,'n',x.n,'held',x.held?.name.slice(0,30),x.held?.y,'clip',x.clip?.y,x.clip?.h,'own',x.own?.y,'next',x.next?.name.slice(0,22),x.next?.y,'ths',JSON.stringify(x.ths.slice(0,3)));
await s.close();
