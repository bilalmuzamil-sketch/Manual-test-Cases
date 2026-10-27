import {sess} from './lib.mjs';
const s=await sess();
await s.go('/reports/punch-clock-activities'); await s.page.waitForTimeout(3500);
await s.page.getByRole('button',{name:'New'}).click(); await s.page.waitForTimeout(2000);
console.log(await s.page.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.dataset.testId+(e.offsetParent?'':'(h)')).join(' | ')));
console.log(await s.page.evaluate(()=>document.querySelector('.q-dialog')?.innerText.slice(0,600)));
await s.page.screenshot({path:'../ev/n1-new-dialog.png'});
await s.browser.close(); process.exit(0);
