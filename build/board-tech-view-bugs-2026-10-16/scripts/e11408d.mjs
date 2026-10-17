import {session,toView} from './rec.mjs';
const s=await session({vp:{width:1440,height:900},dpr:2}); const p=s.page;
const loc=async name=>{ await p.click('[data-test-id=profile_menu_button]'); await p.waitForTimeout(900); await p.click('[data-test-id=select_location]'); await p.waitForTimeout(1200); await p.locator('.q-menu .q-item').filter({hasText:name}).last().click(); await p.waitForTimeout(6000); };
const where=()=>p.evaluate(()=>document.querySelector('[data-test-id=profile_menu_button]')?.innerText.replace(/\s+/g,' ').trim());
await s.go('/workorders?tab=estimates'); await p.waitForTimeout(3500); if(!/Empty Shop/.test(await where())) await loc('ZZAUTOTEST F2 Empty Shop');
await s.go('/workorders?tab=estimates'); await p.waitForTimeout(3000); await toView(p,'list'); await p.mouse.move(700,860); await p.waitForTimeout(2500);
console.log(await p.evaluate(()=>document.body.innerText.includes('No work orders found.')));
await p.screenshot({path:'/home/user/Manual-test-Cases/build/board-tech-view-bugs-2026-10-16/sv11408/ev/estimates-list.png'});
await toView(p,'tech_view'); await loc('Staging Heavy Duty - 9919'); console.log('restored',await where()); await s.close();
