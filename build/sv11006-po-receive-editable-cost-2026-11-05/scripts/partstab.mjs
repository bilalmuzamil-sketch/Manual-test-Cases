import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync(`/tmp/sv11006/seed-branch-${process.argv[2]}.json`,'utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders/'+S.wo+'/parts'); await p.waitForTimeout(4500);
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent&&/receiv|later|kebab|menu|action/i.test(e.getAttribute('data-test-id')+' '+e.innerText)).map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim().replace(/\s+/g,' ').slice(0,30)).slice(0,25).join('\n')));
await p.screenshot({path:'../ev/branch-check4-wo-parts-tab.png'}); await s.close(); process.exit(0);
