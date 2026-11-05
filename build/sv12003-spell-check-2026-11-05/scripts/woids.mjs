import {sess} from './common.mjs'; import fs from 'fs';
const s=await sess(); const p=s.page; const W=JSON.parse(fs.readFileSync('/tmp/sv12003/seed-branch-s1.json','utf8')).wo;
for(const tab of ['lines','details','notes']){ await s.go('/workorders/'+W+'/'+tab).catch(()=>{}); await p.waitForTimeout(3500);
  console.log('==',tab,p.url().split('/').pop(), await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(b=>b.offsetParent&&/customer|vehicle|asset|note|pin/i.test(b.getAttribute('data-test-id'))).map(b=>b.getAttribute('data-test-id')+'='+b.innerText.trim().replace(/\s+/g,' ').slice(0,25)))); }
await s.close(); process.exit(0);
