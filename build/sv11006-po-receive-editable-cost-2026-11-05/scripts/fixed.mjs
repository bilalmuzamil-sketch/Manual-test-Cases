import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/administration/pricing'); await p.waitForTimeout(2500);
const r=await s.api('/api/parts/list-fixed-price?pagination%5BrowsPerPage%5D=3&pagination%5Bpage%5D=1&search='); console.log(JSON.stringify(r.json).slice(0,900));
const tabs=await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(b=>b.offsetParent&&/tab/i.test(b.getAttribute('data-test-id'))).map(b=>b.getAttribute('data-test-id')+'='+b.innerText.trim().slice(0,30))); console.log('tabs',tabs); const ft=p.locator('[data-test-id*=fixed i]').first(); if(await ft.count()){ await ft.click(); await p.waitForTimeout(2500);}
console.log(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(b=>b.offsetParent&&/new|fixed|add|create/i.test(b.getAttribute('data-test-id')+b.innerText)).map(b=>b.getAttribute('data-test-id')+'='+b.innerText.trim().slice(0,30)).slice(0,15)));
await s.close(); process.exit(0);
