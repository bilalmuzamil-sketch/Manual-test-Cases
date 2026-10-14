import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs';
const s=await ob(); const p=s.page; await loc(s);
await s.go('/reports'); await p.waitForTimeout(3500);
const links=await p.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')+'|'+a.innerText.trim().replace(/\s+/g,' ').slice(0,40)).filter(t=>/report/i.test(t)));
console.log('links',J([...new Set(links)],1500));
console.log('text',(await p.evaluate(()=>document.querySelector('main,.q-page')?.innerText.replace(/\s+/g,' ').slice(0,800))));
await s.close();
