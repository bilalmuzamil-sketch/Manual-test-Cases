// walks failure-2 steps literally: click invoice link (new tab), close it, press Tab, read focus + tooltip, press Enter, read tooltip
import {sess} from './common.mjs'; const s=await sess({dpr:1,dir:'/tmp/qa93'}); const p=s.page;
await s.go('/reports/sales-tax/invoices'); await p.waitForTimeout(6000); const row=p.locator('table tbody tr').filter({hasText:'S11116-17580'}).first(); await row.scrollIntoViewIfNeeded();
const tip=async()=>p.evaluate(()=>[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].filter(e=>e.getClientRects().length).map(e=>e.innerText.replace(/\s+/g,' ')).join(' || ')||'(none)');
const [np]=await Promise.all([p.context().waitForEvent('page',{timeout:8000}).catch(()=>null), row.locator('[data-test-id^="link_sales_tax_invoice_"]').click()]); await p.waitForTimeout(1500); if(np) await np.close(); await p.bringToFront(); await p.waitForTimeout(800);
console.log('focus after closing tab',await p.evaluate(()=>document.activeElement?.getAttribute('data-test-id')||document.activeElement?.tagName));
await p.keyboard.press('Tab'); await p.waitForTimeout(1200); console.log('after Tab focus',await p.evaluate(()=>document.activeElement?.getAttribute('data-test-id')?.slice(0,40)||document.activeElement?.tagName),'tip',await tip());
await p.keyboard.press('Enter'); await p.waitForTimeout(1200); console.log('after Enter tip',await tip()); await p.keyboard.press('Enter'); await p.waitForTimeout(1200); console.log('after 2nd Enter tip',await tip());
await s.close(); process.exit(0);
