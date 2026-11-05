import {sess} from './common.mjs'; import fs from 'fs'; const S=JSON.parse(fs.readFileSync(`/tmp/sv12048/wo-${process.argv[2]}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders'); await p.waitForTimeout(4500);
const sr=p.locator('[data-test-id*="search"]').first(); console.log('search ids',await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent&&/search|lead|view_toggle|tab_/i.test(e.getAttribute('data-test-id'))).map(e=>e.getAttribute('data-test-id')).slice(0,20).join(',')));
const row=p.locator('tr',{hasText:S.number}); console.log('row',await row.count());
if(await row.count()) console.log('ROW IDS',await row.first().evaluate(r=>[...r.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim().slice(0,20)).join(' | ')));
await p.screenshot({path:'../ev/K1-list.png'}); await s.close(); process.exit(0);
