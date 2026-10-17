import {session,toView} from './rec.mjs';
const s=await session({vp:{width:1600,height:900},dpr:1}); const p=s.page;
await s.go(`/workorders?tab=all&search=S2-3677`); await p.waitForTimeout(4000); await toView(p,'tech_view'); await p.waitForTimeout(3000);
const st=()=>p.evaluate(()=>({lab:document.querySelector('[data-test-id=button_tech_view_collapse_all]')?.getAttribute('aria-label'),rows:document.querySelectorAll('[data-test-id^=tech_view_row_number_link_]').length,toggles:[...document.querySelectorAll('[data-test-id^=button_tech_view_group_toggle_]')].map(b=>b.getAttribute('aria-expanded')).join(''),disp:document.querySelector('[data-test-id=toggle_display_option]')?.innerText}));
console.log(JSON.stringify(await st())); await p.click('[data-test-id=button_tech_view_collapse_all]'); await p.waitForTimeout(3000); console.log(JSON.stringify(await st()));
await p.screenshot({path:'/tmp/qa11310/dbg18.png'}); await s.close();
