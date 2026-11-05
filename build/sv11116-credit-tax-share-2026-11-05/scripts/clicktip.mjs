// usage: node clicktip.mjs <invoiceNumber> <shotPrefix> -> click-to-pin check: fresh page, mouse elsewhere; click icon; read at +0.3s,+1.5s (on icon); move away; read at +0.5s,+2s,+4s; click again (pinned?) read; screenshots
import {sess} from './common.mjs'; const [INV,PF]=process.argv.slice(2); const s=await sess({dpr:2}); const p=s.page;
await s.go('/reports/sales-tax/invoices'); await p.waitForTimeout(6000);
const row=p.locator('table tbody tr').filter({hasText:INV}).first(); await row.scrollIntoViewIfNeeded(); const icon=row.locator('[data-test-id^="icon_sales_tax_row_credit_info"]').first();
const tip=async()=>p.evaluate(()=>[...document.querySelectorAll('.q-tooltip,.q-menu,[role=tooltip]')].filter(e=>e.offsetParent||e.getClientRects().length).map(e=>e.innerText.replace(/\s+/g,' ')).join(' || ')||'(none)');
const b=await icon.boundingBox(); await p.mouse.move(10,400); await p.waitForTimeout(800);
await p.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:5}); await p.waitForTimeout(150); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(300); console.log('on-icon +0.3s',await tip()); await p.waitForTimeout(1200); console.log('on-icon +1.5s',await tip());
await p.mouse.move(700,700,{steps:5}); await p.waitForTimeout(500); console.log('away +0.5s',await tip()); await p.waitForTimeout(1500); console.log('away +2s',await tip()); await p.screenshot({path:`../ev/${PF}-click-away.png`}); await p.waitForTimeout(2000); console.log('away +4s',await tip());
await p.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:5}); await p.waitForTimeout(600); console.log('back on icon (hover)',await tip()); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(500); await p.mouse.move(700,700,{steps:5}); await p.waitForTimeout(1500); console.log('2nd click then away',await tip());
await s.close(); process.exit(0);
