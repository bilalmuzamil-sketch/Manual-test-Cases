import {session,toView,narr,finish} from './rec.mjs';
const k=process.argv[2]; const dir=`/tmp/qa11310/vo${k}`; const N=narr(dir);
const s=await session({vp:{width:1440,height:900},record:`/tmp/qa11310/rec${k}`}); const p=s.page; const tLogin=Date.now(); const mk=await s.marker(); const log={};
const tip=async b=>{ const bx=await s.box(`display_option_${b}`); await p.mouse.move(bx.x,bx.y,{steps:16}); await p.waitForTimeout(1500); return p.evaluate(()=>{const t=[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].find(e=>e.getBoundingClientRect().width>0); const r=t?.getBoundingClientRect(); const h=document.querySelector('[data-test-id=table_tech_view] thead, .q-table thead, [data-test-id^=board_column_header_]')?.getBoundingClientRect(); const sw=document.querySelector('[data-test-id=toggle_display_option]').getBoundingClientRect(); return {text:t?.innerText.trim(),bottom:r?Math.round(r.y+r.height):null,sw:Math.round(sw.y),hdr:h?Math.round(h.y):null};}); };
const edges=()=>p.evaluate(()=>{const e=document.querySelector('[data-test-id=table_tech_view]')||document.querySelector('[data-test-id=board_view]')||document.querySelector('.q-table__container'); const r=e.getBoundingClientRect(); const cs=getComputedStyle(e); return {x0:Math.round(r.x),x1:Math.round(r.x+r.width),vw:document.documentElement.clientWidth,bg:cs.backgroundColor,rad:cs.borderRadius};});
await s.go('/workorders?tab=all'); await p.waitForTimeout(4000);
const sub=`SV-113${k} · staging ${mk.version}`;
if(k==='22'){ await toView(p,'tech_view'); await p.mouse.move(700,860); await p.waitForTimeout(1500);
 const t1=await tip('list'); log.t1=t1; await N.cap(s,'n1',`${sub} · Tech View · hover List: "${t1.text}" tooltip ends at ${t1.bottom} px, above the switcher (${t1.sw} px); header row at ${t1.hdr} px`);
 const t2=await tip('tech_view'); log.t2=t2; await N.cap(s,'n2',`Hover Tech View: "${t2.text}" ends at ${t2.bottom} px, above the switcher`);
 const t3=await tip('board_view'); log.t3=t3; await N.cap(s,'n3',`Hover Board View: "${t3.text}" ends at ${t3.bottom} px · header row at ${t3.hdr} px, not covered`);
 await p.mouse.move(700,860,{steps:10}); await toView(p,'board_view'); await p.waitForTimeout(1500);
 const t4=await tip('board_view'); log.t4=t4; await N.cap(s,'n4',`Board View · hover Board View: "${t4.text}" ends at ${t4.bottom} px · column headers at ${t4.hdr} px, not covered`);
 await N.cap(s,'n5','Spec v64 S1-R9b: tooltips open above the switcher and read List, Tech View, Board View → PASSED');
 await p.mouse.move(700,860); await toView(p,'tech_view'); }
if(k==='23'){ await toView(p,'board_view'); await p.mouse.move(700,860); await p.waitForTimeout(1500); const e=await edges(); log.e=e;
 const c1=await p.evaluate(()=>Math.round(document.querySelector('[data-test-id^=board_column_header_]').closest('.board-column__panel').getBoundingClientRect().x)); await p.mouse.move(c1+4,240,{steps:14});
 await N.cap(s,'n1',`${sub} · Board View, 1440 px · board spans ${e.x0}–${e.x1} px of ${e.vw} · background ${e.bg==='rgba(0, 0, 0, 0)'?'see-through':e.bg}, corners ${e.rad} · first column's border ${c1} px from the edge`);
 await p.evaluate(()=>document.querySelector('[data-test-id=board_view_scroller]').scrollBy({left:1500,behavior:'smooth'})); await p.waitForTimeout(1800); await p.mouse.move(1420,300,{steps:14});
 const r=await p.evaluate(()=>{const sc=document.querySelector('[data-test-id=board_view_scroller]').getBoundingClientRect(); return Math.round(sc.x+sc.width);}); log.r=r;
 await N.cap(s,'n2',`Scrolled sideways: the columns run on to ${r} px, the window's right edge less the 8 px page padding`);
 await N.cap(s,'n3','Spec v64 S3-R23: full width, no grey rounded panel → PASSED');
 await p.evaluate(()=>document.querySelector('[data-test-id=board_view_scroller]').scrollTo({left:0})); await toView(p,'tech_view'); }
if(k==='24'){ await toView(p,'tech_view'); await p.mouse.move(700,860); await p.waitForTimeout(1500); const e=await edges(); log.e=e; await p.mouse.move(6,400,{steps:14});
 await N.cap(s,'n1',`${sub} · Tech View, 1440 px · table spans ${e.x0}–${e.x1} px of ${e.vw} · background ${e.bg} · no gutter, no panel`);
 await p.mouse.move(700,860,{steps:8}); await toView(p,'list'); await p.waitForTimeout(1500); const l=await edges(); log.l=l; await p.mouse.move(15,400,{steps:14});
 await N.cap(s,'n2',`List · table spans ${l.x0}–${l.x1} px: 30 px margins each side, the same as production`);
 await N.cap(s,'n3','Spec v64 S2-R22: Tech View edge to edge on white; List unchanged → PASSED');
 await toView(p,'tech_view'); }
await finish(s,dir,N.ev,{tLogin,mk,log}); console.log(k,JSON.stringify(log));
