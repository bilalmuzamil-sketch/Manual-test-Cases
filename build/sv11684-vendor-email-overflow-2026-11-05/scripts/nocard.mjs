// usage: node nocard.mjs <companyId> <woId> <partSaleId> -> opens customer page, WO page, part sale page; reports any email-looking text inside cards
import {sess} from './common.mjs'; const [CO,WO,PS]=process.argv.slice(2); const s=await sess({dpr:1}); const p=s.page;
const ats=async()=>p.evaluate(()=>({cards:document.querySelectorAll('.q-card').length,emails:[...document.querySelectorAll('.q-card')].map(c=>c.innerText).join(' ').match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi)||[]}));
for(const [nm,u] of [['customer',`/customers/${CO}/work-orders`],['work order',`/workorders/${WO}/lines`],['part sale',`/parts/part-sale/${PS}`]]){ await s.go(u); await p.waitForTimeout(5000); console.log(nm,p.url().replace(/^https:\/\/[^/]+/,''),JSON.stringify(await ats())); }
await s.close(); process.exit(0);
