import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const s=await ob(); const p=s.page; await loc(s); const X=JSON.parse(fs.readFileSync('X3.json'));
await s.go('/customers/'+X.company_id+'/invoices'); await p.waitForTimeout(4000);
await p.locator('[data-test-id="button_new_payment"]').click(); await p.waitForTimeout(2500);
console.log('ids',J(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/input|select|button_make|payment/.test(t))),700));
console.log('text',J(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].pop()?.innerText.replace(/\s+/g,' ').slice(0,500)),600));
await p.screenshot({path:'ev/X3-1-newpayment.png'});
await s.close();
