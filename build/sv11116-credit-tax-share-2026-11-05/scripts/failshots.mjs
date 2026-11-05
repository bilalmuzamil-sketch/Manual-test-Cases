// usage: node failshots.mjs <invoiceNumber> -> 4 screenshots ../ev/fail-{1-click-on,2-click-away,3-tab,4-tab-enter}.png + rects (icon, tooltip)
import {sess} from './common.mjs'; const [INV]=process.argv.slice(2); const s=await sess({dpr:2,dir:'/tmp/qa93'}); const p=s.page;
await s.go('/reports/sales-tax/invoices'); await p.waitForTimeout(6000); const row=p.locator('table tbody tr').filter({hasText:INV}).first(); await row.scrollIntoViewIfNeeded();
const icon=row.locator('[data-test-id^="icon_sales_tax_row_credit_info"]').first(); const b=await icon.boundingBox(); console.log('ICON',JSON.stringify([b.x,b.y,b.x+b.width,b.y+b.height].map(Math.round)));
const tip=async(t)=>{ const r=await p.evaluate(()=>[...document.querySelectorAll('.q-tooltip,[role=tooltip]')].filter(e=>e.getClientRects().length).map(e=>{const b=e.getBoundingClientRect(); return [e.innerText.replace(/\s+/g,' '),[b.x,b.y,b.right,b.bottom].map(Math.round)];})); console.log(t,JSON.stringify(r)); };
await p.mouse.move(700,820); await p.waitForTimeout(800); await p.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:6}); await p.waitForTimeout(200); await p.mouse.down(); await p.mouse.up(); await p.waitForTimeout(900); await tip('1-click-on'); await p.screenshot({path:'../ev/fail-1-click-on.png'});
await p.mouse.move(700,820,{steps:6}); await p.waitForTimeout(1500); await tip('2-click-away'); await p.screenshot({path:'../ev/fail-2-click-away.png'});
await s.go('/reports/sales-tax/invoices'); await p.waitForTimeout(6000); const row2=p.locator('table tbody tr').filter({hasText:INV}).first(); await row2.scrollIntoViewIfNeeded(); await p.mouse.move(700,820);
await row2.locator('[data-test-id^="link_sales_tax_invoice_"]').focus(); await p.keyboard.press('Tab'); await p.waitForTimeout(1200); console.log('focused',await p.evaluate(()=>document.activeElement?.getAttribute('data-test-id')?.slice(0,30))); await tip('3-tab'); await p.screenshot({path:'../ev/fail-3-tab.png'});
await p.keyboard.press('Enter'); await p.waitForTimeout(1200); await tip('4-tab-enter'); await p.screenshot({path:'../ev/fail-4-tab-enter.png'});
await s.close(); process.exit(0);
