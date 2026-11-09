import {sess} from './common.mjs';
const s=await sess(); const p=s.page; const urls=[];
p.on('request',r=>{ if(r.url().includes('/api/')&&r.url().includes('invent')) urls.push(r.url());});
await s.go('/parts/inventory'); await p.waitForTimeout(4000);
await p.click('[data-test-id="page_search_toggle"]'); await p.keyboard.type('FILTER'); await p.waitForTimeout(3000);
console.log(urls.join('\n'));
const u=urls.filter(x=>x.includes('FILTER')).pop(); const path=u.replace(s.host.api,'');
const r=await s.api(path); console.log(JSON.stringify(r.json).slice(0,1500));
await s.browser.close();
