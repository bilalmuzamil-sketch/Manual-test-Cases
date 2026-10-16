import {session,toView} from './rec.mjs';
const s=await session({vp:{width:1440,height:900},dpr:1}); const p=s.page;
await s.go('/workorders?tab=all'); await p.waitForTimeout(4000); await toView(p,'tech_view'); await p.waitForTimeout(1500);
const lab=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'); if(/Collapse/.test(lab)){await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(1500);} 
await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]'); await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>{const ths=[...document.querySelectorAll('[data-test-id=table_tech_view] thead th')].map(t=>t.innerText.trim()); const r=[...document.querySelectorAll('[data-test-id^=tech_view_row_]')].find(r=>/^tech_view_row_[0-9a-f-]{36}$/.test(r.getAttribute('data-test-id'))); const tds=[...r.querySelectorAll(':scope > td')];
 return ths.join('|')+'\n'+tds.map((td,i)=>i+':'+td.innerHTML.replace(/\s+/g,' ').slice(0,260)).join('\n');}));
await p.click('[data-test-id=button_tech_view_group_toggle_unassigned]'); await s.close();
