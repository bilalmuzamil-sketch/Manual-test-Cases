import {op,J,post,setLoc} from './lib.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('wo1.json'));
const s=await op({dpr:1}); const p=s.page; await setLoc(s);
await s.go('/workorders/'+W.wo+'/lines'); await p.waitForTimeout(4000);
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(x=>/part|add|line_menu|context/i.test(x)).filter((v,i,a)=>a.indexOf(v)===i).slice(0,40).join(' ')));
await p.screenshot({path:'u1.png'});
await s.close();
