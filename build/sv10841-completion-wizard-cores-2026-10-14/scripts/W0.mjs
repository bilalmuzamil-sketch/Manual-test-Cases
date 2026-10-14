import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync(process.argv[2]+'.json')); const s=await ob(); const p=s.page; await loc(s);
await s.go('/workorders/'+A.work_order_id+'/lines'); await p.waitForTimeout(4500);
console.log('buttons',J(await p.evaluate(()=>[...document.querySelectorAll('button,[data-test-id]')].filter(e=>e.offsetParent).map(e=>(e.getAttribute('data-test-id')||'-')+'|'+(e.innerText||'').trim().slice(0,30)).filter(x=>/complet|review|status|wizard|send/i.test(x))),800));
await p.screenshot({path:'ev/'+A.tag+'-wo-lines.png'});
await s.close();
