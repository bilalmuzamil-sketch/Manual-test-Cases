import {sess} from './common.mjs'; import fs from 'fs';
const S=JSON.parse(fs.readFileSync('/tmp/sv12048/wo-B.json','utf8')); const s=await sess({dpr:1}); const p=s.page;
await s.go('/workorders/'+S.wo+'/lines'); await p.waitForTimeout(4500);
const ids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+'='+e.innerText.trim().replace(/\s+/g,' ').slice(0,25)).filter(x=>/status|approv|author|decl|line_/i.test(x)));
console.log(ids.join('\n')); await p.screenshot({path:'../ev/wo-B-pending.png'}); await s.close(); process.exit(0);
