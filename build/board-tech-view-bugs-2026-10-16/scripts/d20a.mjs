import {session,toView} from './rec.mjs'; import fs from 'fs';
const s=await session({vp:{width:1440,height:900},dpr:1}); const p=s.page;
await s.go('/workorders?tab=all&search=ZZAUTOTEST'); await p.waitForTimeout(5000); await toView(p,'tech_view'); await p.waitForTimeout(2500);
const lab=await p.getAttribute('[data-test-id=button_tech_view_collapse_all]','aria-label'); if(/Collapse/.test(lab)){await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(2000);}
const G=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^=button_tech_view_group_toggle_]')].map(b=>({id:b.getAttribute('data-test-id').replace('button_tech_view_group_toggle_',''),cnt:b.closest('[data-test-id^=tech_view_group_]')?.innerText.replace(/\s+/g,' ').slice(0,50)})));
console.log(JSON.stringify(G.filter(g=>!/ 0 0 /.test(g.cnt)))); await s.close();
