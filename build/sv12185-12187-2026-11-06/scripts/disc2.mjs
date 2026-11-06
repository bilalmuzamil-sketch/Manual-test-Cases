import {sess} from './common.mjs';
const s=await sess(); const p=s.page;
const list=(await s.api('/api/customers?pagination%5Bpage%5D=1&pagination%5BrowsPerPage%5D=5')).json.data.collection; console.log(Object.keys(list[1]).join(','));
await s.go('/customers/'+list[1].id); await p.waitForTimeout(4000); console.log(p.url());
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).slice(0,80))));
await p.screenshot({path:'../ev/disc-custpage.png'}); await s.close(); process.exit(0);
