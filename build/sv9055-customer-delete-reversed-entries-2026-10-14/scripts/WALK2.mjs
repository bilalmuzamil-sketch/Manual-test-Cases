import {ob,J} from './lib.mjs'; import {loc} from './seed.mjs';
const s=await ob(); const p=s.page; await loc(s);
await s.go('/customers/6f7f4082-34c7-493d-bc0e-9cf9dc1ab981/work-orders'); await p.waitForTimeout(3500);
for(const t of ['Invoices','Deposits']){ await p.locator('.q-tab',{hasText:t}).click(); await p.waitForTimeout(3000);
 console.log(t,J(await p.evaluate(()=>document.querySelector('.q-tab-panel, main')?.innerText.replace(/\s+/g,' ').slice(0,600)),700)); await p.screenshot({path:`ev/WALK-${t}.png`}); }
await s.close();
