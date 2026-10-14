import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('B2.json')); const s=await ob(); const p=s.page; await loc(s);
await s.go('/workorders/'+A.work_order_id+'/lines'); await p.waitForTimeout(3500);
await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(1000);
console.log('B2 paid WO menu',J(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim()+(e.classList.contains('disabled')||e.getAttribute('aria-disabled')==='true'?'(dis)':''))),400));
await p.screenshot({path:'ev/B2-paid-wo-menu.png'});
await s.close();
