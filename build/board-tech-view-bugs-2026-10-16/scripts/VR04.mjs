import {session,toView,narr,finish} from './rec.mjs';
const dir='/tmp/qa11310/vo04'; const N=narr(dir);
const s=await session({vp:{width:1440,height:900},record:'/tmp/qa11310/rec04'}); const p=s.page; const tLogin=Date.now(); const mk=await s.marker(); const log={};
const ic=()=>p.evaluate(()=>{const e=[...document.querySelectorAll('svg[data-icon*=search], i.q-icon')].find(e=>{const b=e.getBoundingClientRect(); return b.y>60&&b.y<140&&b.width>0&&(e.tagName!=='I'||/search/.test(e.innerText));}); const r=e.getBoundingClientRect(); return (e.getAttribute('data-icon')||'MAT:'+e.innerText.trim())+', '+Math.round(r.width)+' px';});
const point=async()=>{ const b=await p.evaluate(()=>{const e=[...document.querySelectorAll('svg[data-icon*=search]')].find(e=>{const r=e.getBoundingClientRect(); return r.y>60&&r.y<140&&r.width>0;}); const r=e.getBoundingClientRect(); return {x:r.x,y:r.y+r.height/2};}); await p.mouse.move(b.x-14,b.y,{steps:14}); };
await s.go('/workorders?tab=all'); await p.waitForTimeout(4000);
for(const [k,v,n] of [['n1','list','List'],['n2','tech_view','Tech View'],['n3','board_view','Board View']]){ await p.mouse.move(700,860,{steps:6}); await toView(p,v); await p.waitForTimeout(1500); await point(); log[k]=await ic();
 await N.cap(s,k,(k==='n1'?`SV-11404 · staging ${mk.version} · `:'')+`${n} · Search icon: ${log[k]} (design system magnifier)`); }
await s.glideClick('page_search_toggle'); await p.waitForTimeout(700); await p.keyboard.type('S2-33',{delay:120}); await p.waitForTimeout(1800); await point(); log.n4=await ic();
await N.cap(s,'n4',`Search open, typing "S2-33": icon ${log.n4} · Spec v64 S1-R9a → PASSED`);
await s.go('/workorders?tab=all'); await p.waitForTimeout(3000); await toView(p,'tech_view');
await finish(s,dir,N.ev,{tLogin,mk,log}); console.log(JSON.stringify(log));
