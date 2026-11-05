import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-branch-${process.argv[2]}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(4000);
const tab=p.locator('.q-tab, [role=tab]').filter({hasText:/^Parts/}); console.log('tabs',await tab.count()); await tab.first().click(); await p.waitForTimeout(3500); console.log('url',p.url().replace(/^https:\/\/[^/]+/,''));
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim().replace(/\s+/g,' ').slice(0,25)).filter(x=>!/^(profile|nav|menu_main|button_nav)/.test(x)).slice(0,40).join('\n')));
await p.screenshot({path:'../ev/branch-check4-parts-tab.png'}); await s.close(); process.exit(0);
