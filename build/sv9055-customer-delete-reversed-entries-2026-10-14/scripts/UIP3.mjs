import {op,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const E=JSON.parse(fs.readFileSync('NT4.json')); const s=await op(); const p=s.page; await loc(s);
await s.go('/workorders/'+E.work_order_id+'/lines'); await p.waitForTimeout(4000);
await p.locator('[data-test-id="checkbox_select_all_lines"]').click(); await p.waitForTimeout(1200);
await p.locator('[data-test-id="button_work_order_nav_bar_menu"]').click(); await p.waitForTimeout(1000);
console.log('menu with lines ticked',J(await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(e=>e.innerText.trim()+(e.className.includes('disabled')?'(dis)':''))),400));
await p.screenshot({path:'ev/UIP-lines-selected-menu.png'});
await s.close();
