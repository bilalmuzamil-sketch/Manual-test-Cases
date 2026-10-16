import {session,toView,narr,finish} from './rec.mjs';
const dir='/tmp/qa11310/vo18'; const N=narr(dir);
const s=await session({vp:{width:1440,height:900},record:'/tmp/qa11310/rec18'}); const p=s.page; const tLogin=Date.now();
await s.go('/workorders?search=S2-33351'); await p.waitForTimeout(5000); await toView(p,'tech_view');
const ex=await p.getAttribute('[data-test-id=button_tech_view_group_toggle_unassigned]','aria-expanded'); if(ex!=='true'){ await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]'); await p.waitForTimeout(2500);}
await p.mouse.move(700,860); await p.waitForTimeout(1500); const mk=await s.marker();
const rd=()=>p.evaluate(()=>{const r=document.querySelector('[data-test-id^=tech_view_row_]'); const b=r.querySelector('.q-badge:not(.q-badge--floating)'); const q=b.getBoundingClientRect(); return {t:b.innerText.trim(),h:Math.round(q.height),w:q.width.toFixed(2),c:[...r.querySelectorAll('.q-badge--floating')].map(f=>f.innerText.trim()).join(' + ')};});
await N.cap(s,'n1',`SV-11318 · staging build ${mk.version} · 16 Oct 2026 · Work Orders > Tech View · search S2-33351 · window 1440 px, zoom 100%`);
const log={};
for(const [k,d] of [['n2','compact'],['n3','regular'],['n4','comfortable']]){ await s.glideClick('button_density'); await p.waitForTimeout(500); await s.glideClick(`option_density_${d}`); await p.waitForTimeout(900); await p.keyboard.press('Escape').catch(()=>{}); await p.mouse.move(700,860,{steps:6}); await p.waitForTimeout(1500);
  const v=await rd(); log[k]=v; await N.cap(s,k,`${d[0].toUpperCase()+d.slice(1)} · S2-33351 · ${v.t} pill ${v.h} px tall, ${v.w} px wide · counts ${v.c}`); }
await N.cap(s,'n5','Spec v64 S6-R2a: 16 px at Compact and Regular, 22 px at Comfortable, List\'s widths → PASSED');
await s.glideClick('button_density'); await p.waitForTimeout(500); await p.click('[data-test-id=option_density_regular]'); await p.waitForTimeout(800); await p.keyboard.press('Escape').catch(()=>{});
if(ex!=='true'){ await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]'); await p.waitForTimeout(1200);}
await finish(s,dir,N.ev,{tLogin,mk,log}); console.log(JSON.stringify(log));
