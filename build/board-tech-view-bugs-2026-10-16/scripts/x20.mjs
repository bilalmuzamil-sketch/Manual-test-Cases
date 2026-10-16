import {session,toView} from './rec.mjs'; import fs from 'fs';
const quick=process.argv[2]; const s=await session({quick,vp:{width:1440,height:900},dpr:2}); const p=s.page; const mk=await s.marker();
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000); await toView(p,'tech_view'); await p.waitForTimeout(2000);
const lab=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'); if(/Collapse/.test(lab)){await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2000);} 
await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]'); await p.waitForTimeout(2500); await p.mouse.move(1430,890); await p.waitForTimeout(900);
const R=await p.evaluate(()=>{const u=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}};
 const ua=document.querySelector('[data-test-id=tech_view_group_unassigned]')||document.querySelector('[data-test-id=button_tech_view_group_toggle_unassigned]').closest('div');
 const rows=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].filter(r=>/^tech_view_row_[0-9a-f-]{36}$/.test(r.getAttribute('data-test-id'))).slice(0,7);
 const grips=rows.map(r=>document.querySelector(`[data-test-id=tech_view_row_drag_handle_${r.getAttribute('data-test-id').slice(14)}]`)).filter(Boolean).map(u);
 const rr=rows.map(u); const tog=u(document.querySelector('[data-test-id=button_tech_view_group_toggle_unassigned]'));
 return {uaHead:{x:2,y:tog.y-6,w:tog.x-6,h:tog.h+12},grips,rowsLeft:rr.length?{x:2,y:rr[0].y,w:38,h:rr[rr.length-1].y+rr[rr.length-1].h-rr[0].y}:null,nRows:rr.length,nGrips:grips.length};});
await p.screenshot({path:`/tmp/qa11310/x20-${quick}-ua.png`});
await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]'); await p.waitForTimeout(1800); await p.mouse.move(1430,890); await p.waitForTimeout(800);
R.heads=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=tech_view_group_drag_handle_]')].slice(0,8).map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}}));
await p.screenshot({path:`/tmp/qa11310/x20-${quick}-heads.png`});
fs.writeFileSync(`/tmp/qa11310/x20-${quick}.json`,JSON.stringify({mk,R},null,1)); console.log(JSON.stringify({n:R.nRows,g:R.nGrips,h:R.heads.length,ua:R.uaHead})); await s.close();
