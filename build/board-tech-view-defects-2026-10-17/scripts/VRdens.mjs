import {session,toView,narr,finish} from './rec.mjs'; import fs from 'fs';
const T=process.argv[2]; const dir=T==='11397'?'/tmp/qa11310/vo97':'/tmp/qa11310/vo20'; const N=narr(dir);
const s=await session({vp:{width:1920,height:1000},record:'/tmp/qa11310/rec'+T}); const p=s.page; const tLogin=Date.now(); const mk=await s.marker(); const log={};
const OWN=['density','display','collapsedGroups','tab']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const meas=()=>p.evaluate(()=>{const row=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].find(e=>/^tech_view_row_[0-9a-f-]{36}$/.test(e.dataset.testId)&&e.innerText.includes('S2-16688')); const W=e=>e?Math.round(e.getBoundingClientRect().width):null;
 const g=[...document.querySelectorAll('[data-test-id^=tech_view_group_]')].filter(g=>/^tech_view_group_[0-9a-f-]{36}$/.test(g.dataset.testId)&&g.querySelector('.q-avatar')&&g.getBoundingClientRect().top<row.getBoundingClientRect().top).pop();
 const pct=[...row.querySelectorAll('*')].find(x=>x.children.length===0&&/^\d+%$/.test(x.innerText?.trim())); const num=row.querySelector('[data-test-id^=tech_view_row_number_link_]');
 return {g:W(g?.querySelector('.q-avatar')),t:W(row.querySelector('[data-test-id^=avatar_technician_]')),a:W(row.querySelector('[data-test-id^=tech_view_row_advisor_avatar_]')),num:getComputedStyle(num).fontSize,pct:getComputedStyle(pct).fontSize,pctT:pct.innerText.trim()};});
const setD=async d=>{ await s.glideClick('button_density'); await p.waitForTimeout(700); await s.glideClick('option_density_'+d); await p.waitForTimeout(1800); await p.keyboard.press('Escape').catch(()=>{}); await p.mouse.move(1000,950,{steps:6}); await p.waitForTimeout(1200); };
const D={regular:'Regular',compact:'Compact',comfortable:'Comfortable'};
try{
 await s.go('/workorders?tab=all&search=S2-16688'); await p.waitForTimeout(3500); await toView(p,'tech_view'); await p.waitForTimeout(2000);
 for(let k=0;k<2;k++){ if(/Expand/.test(await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'))) break; await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);} await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2500);
 await setD('regular'); await p.evaluate(()=>{[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].find(e=>e.innerText.includes('S2-16688'))?.scrollIntoView({block:'center'});}); await p.waitForTimeout(800);
 const ids=['n1','n2','n3']; const ds=['regular','compact','comfortable'];
 for(let i=0;i<3;i++){ if(i) await setD(ds[i]); const m=await meas(); log[ds[i]]=m;
  const txt=T==='11397'?`${D[ds[i]]}: group header avatar ${m.g} px · technician avatar ${m.t} px · Service Advisor avatar ${m.a} px`:`${D[ds[i]]}: row text (S2-16688) ${m.num} · percentage "${m.pctT}" ${m.pct}`;
  await N.cap(s,ids[i],(i===0?`SV-${T} · staging ${mk.version} · Tech View · `:'')+txt+(T==='11420'&&i===2?' · Spec v64 S6-R4 → PASSED':'')); }
 if(T==='11397'){ await s.go('/workorders?tab=all'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(2000); const b={};
  for(const d of ['compact','regular','comfortable']){ await setD(d); b[d]=await p.evaluate(()=>{const c=[...document.querySelectorAll('.board-card')].find(e=>e.querySelector('.board-card__crew .q-avatar, [data-test-id^=avatar_technician_]')); if(!c) return 'none:'+document.querySelectorAll('.board-card').length; return Math.round(c.querySelector('.board-card__crew .q-avatar, [data-test-id^=avatar_technician_]').getBoundingClientRect().width);}); }
  log.board=b; await N.cap(s,'n4',`Board View card avatars: Compact ${b.compact} px · Regular ${b.regular} px · Comfortable ${b.comfortable} px · Spec v64 S2-R23 → PASSED`); }
}catch(e){ log.err=e.message.slice(0,200); }
try{ const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); }catch(e){}
await finish(s,dir,N.ev,{tLogin,mk,log}); console.log(JSON.stringify(log));
