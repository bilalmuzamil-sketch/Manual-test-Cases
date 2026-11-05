// usage: node linkchk.mjs -> Sales Tax report: invoice link href/target for every row; click first and watch for a new tab / dialog
import {sess} from './common.mjs'; const s=await sess({dpr:1,dir:'/tmp/qa93',...(process.env.ENV==='prod'?{dir:'/tmp/qa92p'}:{})}); const p=s.page;
await s.go('/reports/sales-tax/invoices'); await p.waitForTimeout(6000);
console.log('LINKS',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id^="link_sales_tax_invoice_"]')].slice(0,4).map(a=>[a.tagName,a.getAttribute('href'),a.getAttribute('target'),a.innerText.trim()]))));
const ctx=p.context(); const [np]=await Promise.all([ctx.waitForEvent('page',{timeout:8000}).catch(()=>null), p.locator('[data-test-id^="link_sales_tax_invoice_"]').first().click()]); await p.waitForTimeout(3000);
console.log('new tab',np?np.url():'none','same tab',p.url(),'dialog',(await p.locator('.q-dialog').last().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,200)); if(np){ await np.waitForTimeout(3000); console.log('new tab url',np.url()); }
await s.close(); process.exit(0);
