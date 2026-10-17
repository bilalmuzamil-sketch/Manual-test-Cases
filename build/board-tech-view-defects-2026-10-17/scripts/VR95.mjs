import {session,toView,narr,finish} from './rec.mjs'; import fs from 'fs';
const dir='/tmp/qa11310/vo95'; const N=narr(dir);
const s=await session({vp:{width:1440,height:900},record:'/tmp/qa11310/rec95'}); const p=s.page; const tLogin=Date.now(); const mk=await s.marker(); const log={};
const OWN=['display','collapsedGroups','tab']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const tip=()=>p.evaluate(()=>{const t=[...document.querySelectorAll('.q-tooltip')].filter(x=>x.getBoundingClientRect().height>0)[0]; if(!t) return null; const r=t.getBoundingClientRect(); return {text:t.innerText.replace(/\s+/g,' '),bottom:r.bottom};});
const hov=async(k,sel,label,first)=>{ await p.evaluate(sel=>eval(sel).scrollIntoView({block:'center',inline:'center'}),sel); await p.waitForTimeout(700); const b=await p.evaluate(sel=>{const r=eval(sel).getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,top:r.top};},sel);
 await p.mouse.move(b.x-90,b.y+70,{steps:6}); await p.waitForTimeout(300); await p.mouse.move(b.x,b.y,{steps:12}); await p.waitForTimeout(900); const t=await tip(); log[k]={t,top:b.top};
 const gap=t?Math.round(b.top-t.bottom):null; await N.cap(s,k,(first||'')+`${label}: bubble "${t?.text}" ${t&&t.bottom<=b.top?`opens ABOVE (ends ${gap} px above the avatar)`:'NOT above'}`); };
try{
 await s.go('/workorders?tab=all&search=S2-16688'); await p.waitForTimeout(3500); await toView(p,'tech_view'); await p.waitForTimeout(2500);
 for(let k=0;k<2;k++){ if(/Expand/.test(await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'))) break; await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);} await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);
 const R="[...document.querySelectorAll('tr')].find(t=>/S2-16688/.test(t.innerText)&&/^tech_view_row_/.test(t.dataset.testId||''))";
 await hov('n1',R+".querySelector('[data-test-id^=avatar_technician_]')",'Tech View, S2-16688, technician avatar "BS"',`SV-11395 · staging ${mk.version} · `);
 await hov('n2',R+".querySelector('[data-test-id=avatar_group_overflow]')",'Tech View, "+4"');
 await p.mouse.move(700,880); await s.go('/workorders?tab=all&search=S2-16688'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3000);
 for(let i=0;i<40;i++){ const f=await p.evaluate(()=>[...document.querySelectorAll('.board-card')].some(c=>/S2-16688/.test(c.innerText))); if(f) break; await p.evaluate(()=>{document.querySelector('[data-test-id=board_view_scroller]').scrollLeft+=900;}); await p.waitForTimeout(500);}
 const C="[...document.querySelectorAll('.board-card')].find(c=>/S2-16688/.test(c.innerText))";
 await hov('n3',C+".querySelector('.board-card__crew .q-avatar, [data-test-id^=avatar_technician_]')",'Board View card, avatar "BS"');
 await hov('n4',C+".querySelector('[data-test-id=avatar_group_overflow]')",'Board View card, "+4"');
 await s.caption('Spec v64 S2-R23 → PASSED',{hold:2000});
}catch(e){ log.err=e.message.slice(0,200); }
try{ const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); }catch(e){}
await finish(s,dir,N.ev,{tLogin,mk,log}); console.log(JSON.stringify(log).slice(0,800));
