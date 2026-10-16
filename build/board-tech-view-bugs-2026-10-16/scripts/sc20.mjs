import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:1}); const p=s.page; const out=[]; const seen=new Map();
await s.go('/workorders?tab=all'); await p.waitForTimeout(5000); await toView(p,'tech_view'); await p.waitForTimeout(2500);
const lab=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'); if(/Collapse/.test(lab)){await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2000);} 
await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]'); await p.waitForTimeout(2500);
for(let i=0;i<25;i++){ const r=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].filter(r=>/^tech_view_row_[0-9a-f-]{36}$/.test(r.getAttribute('data-test-id'))).map(r=>{const id=r.getAttribute('data-test-id').slice(14); return [id,!!document.querySelector(`[data-test-id=tech_view_row_drag_handle_${id}]`)];}));
 r.forEach(([id,g])=>seen.set(id,g)); await p.mouse.move(700,600); await p.mouse.wheel(0,2500); await p.waitForTimeout(900); }
const v=[...seen.values()]; console.log(JSON.stringify({rowsSeen:v.length,withGrip:v.filter(Boolean).length}));
await p.evaluate(()=>window.scrollTo(0,0)); await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]').catch(()=>{}); await p.waitForTimeout(1500);
fs.writeFileSync('/tmp/qa11310/sc20.json',JSON.stringify({rowsSeen:v.length,withGrip:v.filter(Boolean).length})); await s.close();
