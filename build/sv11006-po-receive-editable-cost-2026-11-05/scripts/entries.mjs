import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-branch-${process.argv[2]}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
const menu=async()=>p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id], .q-menu .q-item, .q-dialog [data-test-id]')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('data-test-id')||'item')+'='+e.innerText.trim().replace(/\s+/g,' ').slice(0,30)).slice(0,20).join(' | '));
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(4000);
await p.locator(`[data-test-id="line_number_${S.line}"]`).click(); await p.waitForTimeout(1200); console.log('KEBAB',await menu()); await p.keyboard.press('Escape'); await p.waitForTimeout(500);
await p.locator(`[data-test-id="badge_part_status_${S.parts[0].pr}"]`).click(); await p.waitForTimeout(1500); console.log('BADGE',await menu()); await p.keyboard.press('Escape'); await p.waitForTimeout(500);
await p.getByText(/^Parts \(\d+\)$/).first().click(); await p.waitForTimeout(3500); console.log('PARTSTAB url',p.url().replace(/^https:\/\/[^/]+/,''),await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent&&/receiv|button|action|menu|kebab/i.test(e.getAttribute('data-test-id'))).map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim().replace(/\s+/g,' ').slice(0,25)).slice(0,25).join(' | ')));
await p.screenshot({path:'../ev/branch-check4-parts-tab.png'}); await s.close(); process.exit(0);
