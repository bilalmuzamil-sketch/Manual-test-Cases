import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-branch-${process.argv[2]}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(4000); const t=p.locator('[data-test-id="line_title"]'); console.log('titles',await t.count());
for(let i=0;i<await t.count();i++){ await t.nth(i).click({button:'right'}); await p.waitForTimeout(1200); console.log('menu',i,await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim().replace(/\s+/g,' ').slice(0,30)).join(' | '))); await p.keyboard.press('Escape'); await p.waitForTimeout(500); }
console.log('receive-ish ids',await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent&&/receiv/i.test(e.getAttribute('data-test-id')+e.innerText)).map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim().slice(0,30)).slice(0,15)));
await p.screenshot({path:'../ev/branch-check4-wo-lines.png'}); await s.close(); process.exit(0);
