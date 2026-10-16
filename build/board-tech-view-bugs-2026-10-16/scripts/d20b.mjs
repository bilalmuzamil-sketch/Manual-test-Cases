import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:1}); const p=s.page; const out={};
const F='07253c44-3af0-4164-8a6d-0039dd74034c', P='55319163-e4c8-4099-82b2-4f5e9e98c125';
await s.go('/workorders?tab=all&search=ZZAUTOTEST'); await p.waitForTimeout(5000); await toView(p,'tech_view'); await p.waitForTimeout(2500);
const lab=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'); if(/Collapse/.test(lab)){await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2000);}
for(const g of [F,P]){ await p.click(`[data-test-id=button_tech_view_group_toggle_${g}]`); await p.waitForTimeout(2000); }
const st=()=>p.evaluate(([F,P])=>{const rows=g=>{const gr=document.querySelector(`[data-test-id=tech_view_group_${g}]`); return [...document.querySelectorAll('[data-test-id^=tech_view_row_]')].filter(r=>/^tech_view_row_[0-9a-f-]{36}$/.test(r.getAttribute('data-test-id'))).map(r=>({id:r.getAttribute('data-test-id').slice(14),num:document.querySelector(`[data-test-id=tech_view_row_number_link_${r.getAttribute('data-test-id').slice(14)}]`)?.innerText.trim(),y:Math.round(r.getBoundingClientRect().y),h:Math.round(r.getBoundingClientRect().height)}));};
 const hy=g=>{const b=document.querySelector(`[data-test-id=button_tech_view_group_toggle_${g}]`).getBoundingClientRect();return Math.round(b.y);};
 return {fy:hy(F),py:hy(P),rows:rows()};},[F,P]);
out.s0=await st(); console.log('s0',JSON.stringify(out.s0)); await p.screenshot({path:'/tmp/qa11310/d20b-0.png'});
fs.writeFileSync('/tmp/qa11310/d20b.json',JSON.stringify(out,null,1)); await s.close();
