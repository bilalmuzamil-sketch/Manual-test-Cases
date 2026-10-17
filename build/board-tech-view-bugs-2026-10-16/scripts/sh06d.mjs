import {session,toView} from './rec.mjs'; import fs from 'fs';
const quick=process.argv[2]||'tech'; const search=process.argv[3]||''; const s=await session({quick,vp:{width:1440,height:900},dpr:1}); const p=s.page; const out={quick,search,mk:await s.marker(),steps:[]};
const get=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value;
const put=async v=>(await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})})).status;
const before=await get();
const snap=()=>p.evaluate(()=>{
 const held=[...document.querySelectorAll('[data-test-id=tech_view_sticky_group]')].filter(e=>{const r=e.getBoundingClientRect(); const cs=getComputedStyle(e); return r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none';});
 const toggles=[...document.querySelectorAll('[data-test-id^=button_tech_view_group_toggle_]')];
 const heads=toggles.map(b=>{const tr=b.closest('tr'); const r=tr.getBoundingClientRect(); return {id:b.dataset.testId.slice(30),name:tr.innerText.replace(/\s+/g,' ').trim(),top:r.top,bottom:r.bottom};});
 const h=held[0]; if(!h) return {sy:scrollY,held:null,n:held.length};
 const r=h.getBoundingClientRect(); const clip=h.closest('.tech-view__held').getBoundingClientRect();
 const name=h.innerText.replace(/\s+/g,' ').trim();
 // held group = last header whose top < clip.bottom (passed under) ... find by name
 const idx=heads.findIndex(x=>x.name.split(' (')[0]===name.split(' (')[0]);
 const next=heads[idx+1];
 return {sy:Math.round(scrollY),n:held.length,name:name.slice(0,34),top:+r.top.toFixed(1),bottom:+r.bottom.toFixed(1),clipTop:+clip.top.toFixed(1),clipBottom:+clip.bottom.toFixed(1),
   own:idx>=0?+heads[idx].top.toFixed(1):null,nextName:next?next.name.slice(0,24):null,nextTop:next?+next.top.toFixed(1):null,rowsAfterOwn:idx>=0&&next?Math.round((next.top-heads[idx].bottom)):null};});
try{
 await s.go('/workorders?tab=all'+(search?'&search='+encodeURIComponent(search):'')); await p.waitForTimeout(4500); await toView(p,'tech_view'); await p.waitForTimeout(2500);
 out.label0=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'); for(let k=0;k<2;k++){ if(/Expand/.test(await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'))) break; await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(3000);} await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(3500); out.open=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].filter(e=>/^tech_view_row_[0-9a-f-]{36}$/.test(e.dataset.testId)).length); 
 out.label1=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label');
 await p.mouse.move(700,600);
 const N=+process.argv[4]||160;
 for(let i=0;i<N;i++){ const sn=await snap(); out.steps.push(sn); await p.mouse.wheel(0,20); await p.waitForTimeout(110); }
 for(let i=0;i<N;i++){ await p.mouse.wheel(0,-20); await p.waitForTimeout(110); const sn=await snap(); sn.dir='up'; out.steps.push(sn); }
}catch(e){ out.err=e.message.slice(0,300); }
const cur=await get(); out.put=await put({...cur,collapsedGroups:before.collapsedGroups}); out.restored=JSON.stringify((await get()).collapsedGroups)===JSON.stringify(before.collapsedGroups);
fs.writeFileSync(`/tmp/qa11310/sh06d-${quick}-${search.replace(/ /g,'')}.json`,JSON.stringify(out,null,1));
// checks: held.top should = min(clipTop, nextTop - height) whenever the next header is within reach
let bad=[],push=0,held=0; const H=44;
for(const x of out.steps){ if(!x.name) continue; held++; const exp=x.nextTop!==null? Math.min(x.clipTop, x.nextTop-(x.bottom-x.top)) : x.clipTop; if(exp<x.clipTop-0.5) push++; if(Math.abs(exp-x.top)>1.5) bad.push([x.dir||'dn',x.sy,x.name,x.top,exp,x.nextName,x.nextTop]); }
console.log(JSON.stringify({err:out.err,label0:out.label0,label1:out.label1,steps:out.steps.length,withHeld:held,maxN:Math.max(...out.steps.map(x=>x.n||0)),pushFrames:push,mismatch:bad.length,restored:out.restored}));
console.log('first mism',JSON.stringify(bad.slice(0,8)));
const names=[...new Set(out.steps.filter(x=>x.name).map(x=>x.name.slice(0,22)))]; console.log('held sequence',names.slice(0,30).join(' | '));
await s.close();
