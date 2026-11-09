import {sess} from './common.mjs';
const s=await sess(); const p=s.page;
console.log('marker', await s.api('/../index.html').then(()=>null).catch(()=>null));
const m=await p.evaluate(()=>document.querySelector('meta[name="app-version"]')?.content); console.log('app-version',m);
console.log(await s.go('/parts/inventory'));
await p.waitForTimeout(4000);
const ids=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/menu|kebab|more|print|cycle|filter|search/i.test(t)));
console.log([...new Set(ids)].join('\n'));
await p.screenshot({path:'../ev/probe.png'}); await s.browser.close();
