import {op,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const E=JSON.parse(fs.readFileSync('NT4.json')); const s=await op(); const p=s.page; await loc(s);
const vis=()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-test-id')).filter(t=>/delete|remove|trash|bulk|menu|action|select_row|checkbox/i.test(t)));
// 1 WO page lines tab
await s.go('/workorders/'+E.work_order_id+'/lines'); await p.waitForTimeout(4000);
console.log('lines tids',J(await vis(),600));
await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(900);
console.log('lines menu',J(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim())),200)); await p.keyboard.press('Escape');
// 2 work orders list
await s.go('/workorders'); await p.waitForTimeout(4000);
for(const t of ['All','Completed']){ await p.getByText(t,{exact:true}).first().click().catch(()=>{}); await p.waitForTimeout(2500); }
await p.locator('[data-test-id="page_search_toggle"]').click().catch(()=>{}); await p.waitForTimeout(600);
await p.locator('[data-test-id="page_search_input"]').fill('S2-975').catch(e=>console.log('nosearch')); await p.waitForTimeout(3500);
console.log('list rows',J(await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(r=>r.innerText.replace(/\s+/g,' ').slice(0,120))),400));
console.log('list tids',J(await vis(),600));
const cb=p.locator('tbody tr .q-checkbox').first(); if(await cb.count()){ await cb.click(); await p.waitForTimeout(1200); console.log('after select',J(await p.evaluate(()=>[...document.querySelectorAll('button')].filter(e=>e.offsetParent).map(e=>e.innerText.trim()).filter(Boolean)),500)); }
await p.locator('tbody tr').first().click({button:'right'}).catch(()=>{}); await p.waitForTimeout(900);
console.log('rightclick menu',J(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim())),200));
await p.screenshot({path:'ev/UIP-list.png'});
// 3 customer work orders tab
await s.go('/customers/'+E.company_id+'/work-orders'); await p.waitForTimeout(4000);
console.log('cust tids',J(await vis(),400));
await s.close();
