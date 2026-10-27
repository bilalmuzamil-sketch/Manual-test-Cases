import {sess} from './lib.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync('../data/wo1.json'));
const s=await sess();
let r=await s.api('/api/roles/73f72525-3d67-436b-9c1d-12677cdf9883'); console.log('fe sample',JSON.stringify(r.json.data.fe_permissions.slice(0,2)),'view',r.json.data.view_mode,'cross',JSON.stringify(r.json.data.cross_toggles));
await s.go('/administration/roles-permissions/73f72525-3d67-436b-9c1d-12677cdf9883/edit'); await s.page.waitForTimeout(3000);
const tog=await s.page.evaluate(()=>[...document.querySelectorAll('[data-test-id^="wosetting"]')].map(e=>e.dataset.testId+'='+(e.getAttribute('aria-checked')??e.querySelector('[aria-checked]')?.getAttribute('aria-checked')??e.className.match(/q-toggle__inner--(truthy|falsy)/)?.[1]??(e.querySelector('.q-toggle__inner')?.className.match(/(truthy|falsy)/)?.[1]))));
console.log('toggles',tog.join(' | '));
const el=await s.page.$('[data-test-id="wosetting_movelabor"]'); if(el){await el.scrollIntoViewIfNeeded(); await s.page.screenshot({path:'../ev/branch-0-role-movelabor.png'});}
await s.go('/workorders/'+W.wo+'/lines'); await s.page.waitForTimeout(3500);
const b=await s.box('line_number_'+W.lines[0]); await s.page.mouse.click(b.x+250,b.y,{button:'right'}); await s.page.waitForTimeout(1200);
console.log('menu',await s.page.evaluate(()=>[...document.querySelectorAll('[data-test-id^="menu-item_"]')].map(e=>e.dataset.testId).join(',')));
await s.page.screenshot({path:'../ev/branch-1-context-menu.png'});
await s.browser.close(); process.exit(0);
