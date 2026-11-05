// usage: node taptip.mjs <invoiceNumber> <shotPrefix> [device="iPhone 12 Pro"] -> phone preset: tap icon, read tooltip, wait 3s read, tap again read, tap elsewhere read; screenshots
import {sess} from './common.mjs'; const [INV,PF,DEV]=process.argv.slice(2); const s=await sess({device:DEV||'iPhone 12 Pro'}); const p=s.page;
await s.go('/reports/sales-tax/invoices'); await p.waitForTimeout(7000);
const tip=async()=>p.evaluate(()=>[...document.querySelectorAll('.q-tooltip,.q-menu,[role=tooltip]')].filter(e=>e.offsetParent||e.getClientRects().length).map(e=>e.innerText.replace(/\s+/g,' ')).join(' || ')||'(none)');
const icon=p.locator('[data-test-id^="icon_sales_tax_row_credit_info"]').first(); console.log('icon',await icon.count(), p.viewportSize()); await icon.scrollIntoViewIfNeeded(); const b=await icon.boundingBox(); console.log('rect',JSON.stringify(b));
await p.screenshot({path:`../ev/${PF}-phone-0.png`});
await p.touchscreen.tap(b.x+b.width/2,b.y+b.height/2); await p.waitForTimeout(800); console.log('tap1',await tip()); await p.screenshot({path:`../ev/${PF}-phone-1-tap.png`}); await p.waitForTimeout(3000); console.log('tap1 +3s',await tip());
await p.touchscreen.tap(b.x+b.width/2,b.y+b.height/2); await p.waitForTimeout(1000); console.log('tap2',await tip()); await p.screenshot({path:`../ev/${PF}-phone-2-tap2.png`});
await s.close(); process.exit(0);
