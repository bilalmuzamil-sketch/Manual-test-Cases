import {sess} from './common.mjs'; const s=await sess(); const p=s.page;
const r=await s.api('/api/part-sales?pagination[page]=1&pagination[rowsPerPage]=5'); console.log(r.status, JSON.stringify(r.json).slice(0,600));
await s.go('/parts/part-sales'); await p.waitForTimeout(4000); console.log(p.url());
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>e.getAttribute('data-test-id')).slice(0,60).join(',')));
await p.screenshot({path:'../ev/ps-probe.png'}); await s.close();
