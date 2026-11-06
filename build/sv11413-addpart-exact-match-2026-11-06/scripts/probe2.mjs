import {sess} from './common.mjs'; import fs from 'fs'; const E=process.env.ENV||'branch'; const W=JSON.parse(fs.readFileSync(`/tmp/sv11413-${E}-wo.json`,'utf8'));
const s=await sess(); const p=s.page; await s.go('/workorders/'+W.id+'/lines'); await p.waitForTimeout(8000);
await p.click('[data-test-id="button_add_part"]'); await p.waitForTimeout(3000); console.log(p.url()); console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')+'='+(e.innerText||'').replace(/\s+/g,' ').slice(0,25)).filter(x=>!/nav|clock|notif|profile|module|search_trigger|skip/.test(x)).slice(-45))));
await p.screenshot({path:'../ev/'+E+'-lines.png'}); await s.close(); process.exit(0);
