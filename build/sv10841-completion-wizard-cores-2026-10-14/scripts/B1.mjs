import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync(process.argv[2]+'.json')); const s=await ob(); const p=s.page; await loc(s);
await s.go('/workorders/'+A.work_order_id+'/lines'); await p.waitForTimeout(5000);
const t=await p.evaluate(()=>[...document.querySelectorAll('button,[role=button]')].filter(b=>b.offsetParent).map(b=>(b.getAttribute('data-test-id')||'-')+'|'+b.innerText.trim().replace(/\s+/g,' ').slice(0,40)).filter(x=>/complete|core|finish|review|resolve|ok/i.test(x)));
console.log('buttons',J(t,1500)); await p.screenshot({path:`ev/${A.tag}-wo-after-defer.png`}); await s.close();
