import {sess} from './common.mjs'; import fs from 'fs'; const E=process.env.ENV||'branch'; const W=JSON.parse(fs.readFileSync(`/tmp/sv11413-${E}-wo.json`,'utf8'));
const s=await sess(); const p=s.page; await s.go('/workorders/'+W.id+'/lines'); await p.waitForTimeout(8000);
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')+'='+(e.innerText||'').replace(/\s+/g,' ').slice(0,25)).filter(x=>/part|add|line_expand/i.test(x)).slice(0,30))));
await p.screenshot({path:'../ev/'+E+'-lines.png'}); await s.close(); process.exit(0);
