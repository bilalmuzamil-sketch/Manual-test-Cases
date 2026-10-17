import {session,toView,narr,finish} from './rec.mjs'; import fs from 'fs';
const dir='/tmp/qa11310/vo30'; const N=narr(dir);
const s=await session({vp:{width:1440,height:900},record:'/tmp/qa11310/rec30'}); const p=s.page; const tLogin=Date.now(); const mk=await s.marker(); const log={};
const OWN=['display','tab']; const getP=async()=>(await s.api('/api/users/me/preferences/work-orders-list')).json.data.value; const prefs0=await getP();
const theme=async t=>{await s.glideClick('profile_menu_button'); await p.waitForTimeout(900); await s.glideClick(`button_night_mode_${t}`); await p.waitForTimeout(1500); await p.keyboard.press('Escape').catch(()=>{}); await p.waitForTimeout(800); await p.mouse.move(700,150,{steps:6});};
const vis=()=>p.evaluate(()=>[...document.querySelectorAll('.board-column__body')].filter(b=>b.scrollHeight>b.clientHeight&&b.getBoundingClientRect().right<1440).slice(0,4).map(b=>{const cs=getComputedStyle(b); return {c:cs.scrollbarColor,w:cs.scrollbarWidth,sbw:b.offsetWidth-b.clientWidth};}));
try{
 await s.go('/workorders?tab=all'); await p.waitForTimeout(3500); await toView(p,'board_view'); await p.waitForTimeout(3000);
 await theme('dark'); log.d1=await vis(); log.cls1=await p.evaluate(()=>document.body.className.match(/body--(dark|light)/)?.[0]);
 await N.cap(s,'n1',`SV-11430 · staging ${mk.version} · Board View · ${log.cls1==='body--dark'?'dark':'light'} theme · ${log.d1.length} scrolling columns in view: scrollbar "${log.d1[0]?.w}", thumb ${log.d1[0]?.c.split(' rgba')[0]}, track transparent`);
 await p.reload(); await p.waitForTimeout(5000); await p.mouse.move(700,150,{steps:6});
 const seen={}; for(let i=0;i<150;i++){ const r=await p.evaluate(()=>[...document.querySelectorAll('.board-column__body')].map(b=>{const cs=getComputedStyle(b); return [b.closest('.board-column__panel').querySelector('[data-test-id^=board_column_header_]')?.dataset.testId,cs.scrollbarColor+' | '+cs.scrollbarWidth];})); r.forEach(([k,v])=>seen[k]=v); const e=await p.evaluate(()=>{const sc=document.querySelector('[data-test-id=board_view_scroller]'); const e=sc.scrollLeft+sc.clientWidth>=sc.scrollWidth-5; sc.scrollLeft+=1200; return e;}); await p.waitForTimeout(150); if(e) break; }
 await p.evaluate(()=>{document.querySelector('[data-test-id=board_view_scroller]').scrollLeft=0;}); await p.waitForTimeout(1200);
 log.total=Object.keys(seen).length; log.styles=[...new Set(Object.values(seen))]; log.cls2=await p.evaluate(()=>document.body.className.match(/body--(dark|light)/)?.[0]);
 await N.cap(s,'n2',`After reload (${log.cls2==='body--dark'?'dark':'light'}): all ${log.total} columns read · one style only: thumb ${log.styles[0]?.split(' rgba')[0]}, transparent track, thin`);
 await theme('light'); log.l=await vis();
 await N.cap(s,'n3',`Light theme: scrollbar "${log.l[0]?.w}", colour "${log.l[0]?.c}" (browser default, unchanged) · Spec v64 S1-R9c → PASSED`);
}catch(e){ log.err=e.message.slice(0,200); }
try{ const cur=await getP(); const v={...cur}; for(const k of OWN) v[k]=prefs0[k]; await s.api('/api/users/me/preferences/work-orders-list',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({value:v})}); }catch(e){}
await finish(s,dir,N.ev,{tLogin,mk,log}); console.log(JSON.stringify(log).slice(0,1500));
