import {op,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const E=JSON.parse(fs.readFileSync('NT4.json')); const s=await op(); const p=s.page; await loc(s);
await s.go('/workorders/'+E.work_order_id+'/lines'); await p.waitForTimeout(4000);
await p.locator('[data-test-id="checkbox_select_all_lines"]').click(); await p.waitForTimeout(1200);
console.log('bulk btns',J(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')+'|'+e.innerText.trim().slice(0,30)).filter(x=>/button|menu/.test(x))),700));
const m=p.locator('[data-test-id*="bulk"], [data-test-id*="selected"]').first(); if(await m.count()){ await m.click(); await p.waitForTimeout(900); console.log('bulk menu',J(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim())),300)); }
await p.screenshot({path:'ev/UIP-lines-selected.png'});
await s.go('/workorders'); await p.waitForTimeout(5000);
await p.getByText('Completed',{exact:true}).first().click(); await p.waitForTimeout(3000);
await p.locator('[data-test-id="page_search_toggle"]').click(); await p.waitForTimeout(600);
await p.locator('[data-test-id="page_search_input"]').fill('975'); await p.waitForTimeout(5000);
console.log('rows',J(await p.evaluate(()=>[...document.querySelectorAll('tr')].map(r=>r.innerText.replace(/\s+/g,' ').slice(0,90)).filter(Boolean)),500));
console.log('row tids',J(await p.evaluate(()=>[...document.querySelectorAll('tbody [data-test-id], tbody button')].map(e=>(e.getAttribute('data-test-id')||e.tagName)+'|'+e.innerText.trim().slice(0,20))),400));
await p.screenshot({path:'ev/UIP-list.png'});
await s.close();
