import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs'; import fs from 'fs';
const s=await ob(); const p=s.page; await loc(s); const X=JSON.parse(fs.readFileSync('X3.json'));
await s.go('/customers/'+X.company_id+'/invoices'); await p.waitForTimeout(4500);
const b=p.locator('[data-test-id="button_new_payment"]');
console.log('np',await b.count(),J(await b.first().evaluate(e=>({dis:e.disabled||e.getAttribute('aria-disabled'),cls:e.className,vis:e.getBoundingClientRect().width})),300));
await b.first().hover({force:true}); await p.waitForTimeout(1000);
console.log('tip',J(await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip')].map(e=>e.innerText)),300));
await p.screenshot({path:'ev/X3-0-invoices.png'});
await s.close();
