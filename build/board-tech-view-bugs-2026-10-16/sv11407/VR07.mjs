import {session,toView,narr,finish} from './rec.mjs'; import fs from 'fs';
const dir='/tmp/qa11310/vo07'; const N=narr(dir);
const s=await session({quick:'tech',vp:{width:1440,height:900},record:'/tmp/qa11310/rec07'}); const p=s.page; const tLogin=Date.now(); const mk=await s.marker(); const log={};
const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const meas=(view)=>p.evaluate((view)=>{
 const R=e=>e.getBoundingClientRect();
 if(view==='tech_view'){
  const sc=document.querySelector('.q-table__middle'); const th=R(document.querySelector('[data-test-id=table_tech_view] thead'));
  const held=[...document.querySelectorAll('[data-test-id=tech_view_sticky_group]')].find(e=>{const r=R(e); const cs=getComputedStyle(e); return r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none';});
  const clip=held?R(held.closest('.tech-view__held')):null; const top=clip? Math.max(th.bottom, clip.bottom): th.bottom;
  const rows=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].filter(e=>/^tech_view_row_[0-9a-f-]{36}$/.test(e.dataset.testId));
  const vis=rows.map(e=>({id:e.dataset.testId.slice(14),num:(e.querySelector('[data-test-id^=tech_view_row_number_link_]')||{}).innerText,t:R(e).top,b:R(e).bottom})).filter(r=>r.b>top+1).sort((a,b)=>a.t-b.t);
  return {cols:[{name:'table',scrollTop:Math.round(sc.scrollTop),scrollLeft:Math.round(sc.scrollLeft),viewTop:Math.round(top),heldName:held?held.innerText.replace(/\s+/g,' ').trim().slice(0,30):null,first:vis[0]?{num:vis[0].num,id:vis[0].id,t:Math.round(vis[0].t),b:Math.round(vis[0].b)}:null,second:vis[1]?{num:vis[1].num,t:Math.round(vis[1].t)}:null}]};
 } else {
  const scr=document.querySelector('[data-test-id=board_view_scroller]');
  const bodies=[...document.querySelectorAll('.board-column__body')].filter(b=>{const r=R(b); return r.width>0&&r.left<1440&&r.right>0;});
  return {scrollLeft:Math.round(scr.scrollLeft),cols:bodies.slice(0,5).map(b=>{const col=b.closest('[data-test-id^=board_column_]')||b.parentElement; const hdr=b.closest('.board-column__panel')?.querySelector('[data-test-id^=board_column_header_]'); const top=R(b).top; const cards=[...b.querySelectorAll('[data-test-id^=board_card_]')].filter(c=>/^board_card_[0-9a-f-]{36}$/.test(c.dataset.testId)).map(c=>({id:c.dataset.testId.slice(11),num:(c.innerText.match(/S\d-\d+/)||[''])[0],t:R(c).top,b:R(c).bottom})).filter(c=>c.b>top+1).sort((a,b)=>a.t-b.t);
   return {name:hdr?hdr.innerText.replace(/\s+/g,' ').trim().slice(0,24):'?',x:Math.round(R(b).left),scrollTop:Math.round(b.scrollTop),viewTop:Math.round(top),first:cards[0]?{num:cards[0].num,id:cards[0].id,t:Math.round(cards[0].t),b:Math.round(cards[0].b)}:null};})};
 }},view);

const cut=async(view,pt,frac)=>{ await p.mouse.move(pt.x,pt.y,{steps:8}); await p.mouse.wheel(0,900); await p.waitForTimeout(1500); let m=(await meas(view)).cols.find(c=>view==='tech_view'||Math.abs(c.x-(pt.x-140))<5)||(await meas(view)).cols[0]; const f=m.first; const want=Math.round(m.viewTop-frac*(f.b-f.t)); const d=Math.round(f.t-want); if(d){ await p.mouse.wheel(0,d); await p.waitForTimeout(1200);} };
const fmtT=c=>`${c.first.num} top ${c.first.t} px vs header bottom ${c.viewTop} px`;
try{
 await s.go('/workorders?tab=all'); await p.waitForTimeout(3500); await toView(p,'tech_view'); await p.waitForTimeout(2500);
 for(let k=0;k<2;k++){ if(/Expand/.test(await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'))) break; await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);} await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(3000);
 await cut('tech_view',{x:700,y:500},0.5); log.tb=(await meas('tech_view')).cols[0];
 await N.cap(s,'n1',`SV-11407 · staging ${mk.version} · Tech user · Tech View · top row ${log.tb.first.num} half hidden (${log.tb.first.t}–${log.tb.first.b} px, header ends ${log.tb.viewTop} px)`);
 const r=await p.evaluate(()=>{const rows=[...document.querySelectorAll('[data-test-id^=tech_view_row_number_link_]')].filter(e=>e.getBoundingClientRect().top>350&&e.getBoundingClientRect().top<650); const e=rows[0]; const b=e.getBoundingClientRect(); return {x:b.x+12,y:b.y+b.height/2,n:e.innerText.trim()};});
 await p.mouse.move(r.x,r.y,{steps:12}); await p.mouse.click(r.x,r.y); await p.waitForTimeout(3500); await s.caption(`Opened ${r.n} → browser Back`,{hold:1500}); await p.goBack(); await p.waitForTimeout(5000); await p.mouse.move(1000,880,{steps:6});
 log.ta=(await meas('tech_view')).cols[0]; await N.cap(s,'n2',`After Back: ${fmtT(log.ta)} → ${log.ta.first.num===log.tb.first.num&&log.ta.first.t>=log.ta.viewTop-1?'same row, FULLY SHOWN':'NOT fully shown'}`);
 await toView(p,'board_view'); await p.waitForTimeout(3000);
 const cols=(await meas('board_view')).cols.slice(0,3); for(const c of cols) await cut('board_view',{x:c.x+140,y:500},0.5); await p.mouse.move(1000,880,{steps:6}); await p.waitForTimeout(800);
 log.bb=(await meas('board_view')).cols.slice(0,3); await N.cap(s,'n3',`Board View · top cards half hidden: ${log.bb.map(c=>c.name.split(' ').slice(0,2).join(' ')+' '+c.first.num).join(' · ')}`);
 const c2=await p.evaluate(()=>{const cs=[...document.querySelectorAll('[data-test-id^=board_card_]')].filter(e=>/^board_card_[0-9a-f-]{36}$/.test(e.dataset.testId)&&e.getBoundingClientRect().top>400&&e.getBoundingClientRect().top<650&&e.getBoundingClientRect().left<300); const e=cs[0]; const b=e.getBoundingClientRect(); return {x:b.x+b.width-40,y:b.y+40,n:e.innerText.match(/S\d-\d+/)[0]};});
 await p.mouse.move(c2.x,c2.y,{steps:12}); await p.mouse.click(c2.x,c2.y); await p.waitForTimeout(3500); await s.caption(`Opened ${c2.n} → browser Back`,{hold:1500}); await p.goBack(); await p.waitForTimeout(6000); await p.mouse.move(1000,880,{steps:6});
 log.ba=(await meas('board_view')).cols.slice(0,3);
 await N.cap(s,'n4',log.ba.map(c=>`${c.name.split(' ').slice(0,2).join(' ')}: ${c.first.num} ${c.first.t>=c.viewTop-1?'fully shown':'CUT '+(c.viewTop-c.first.t)+' px'}`).join(' · ')+' → PARTIALLY PASSED');
}catch(e){ log.err=e.message.slice(0,200); }
{ const cur=await getP(); await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:{...cur,collapsedGroups:prefs0.collapsedGroups,display:prefs0.display}})}); }
await finish(s,dir,N.ev,{tLogin,mk,log}); console.log(JSON.stringify({tb:log.tb?.first,ta:log.ta?.first,bb:log.bb?.map(c=>[c.name.slice(0,12),c.first.num,c.first.t,c.viewTop]),ba:log.ba?.map(c=>[c.name.slice(0,12),c.first.num,c.first.t,c.viewTop]),err:log.err}));
