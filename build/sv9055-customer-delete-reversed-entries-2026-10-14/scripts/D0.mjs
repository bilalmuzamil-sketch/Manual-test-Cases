import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync(process.argv[2])); const s=await ob(); const p=s.page; await loc(s);
await s.go('/customers/'+A.company_id+'/work-orders'); await p.waitForTimeout(3500);
console.log('tids',J(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')).filter(t=>!/nav|profile|module|clock|notif|global|skip/.test(t))),900));
await s.close();
