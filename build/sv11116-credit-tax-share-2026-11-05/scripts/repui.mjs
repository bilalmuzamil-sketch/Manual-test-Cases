// usage: node repui.mjs <invoiceNumber> <shotPrefix> [range] -> Sales Tax report: the row's cells + test-ids; hover/click/keyboard the info icon; screenshots ../ev/<prefix>-*.png; prints tooltip texts + icon/amount rects
import {sess} from './common.mjs'; const [INV,PF]=process.argv.slice(2); const s=await sess({dpr:2,...(process.env.MOBILE?{device:'iPhone 12 Pro'}:{})}); const p=s.page;
await s.go('/reports/sales-tax/invoices'); await p.waitForTimeout(6000);
const row=p.locator('table tbody tr').filter({hasText:INV}).first(); console.log('row',await row.count()); await row.scrollIntoViewIfNeeded();
console.log('ROW',(await row.innerText()).replace(/\s+/g,' | ')); console.log('ROWIDS',await row.evaluate(r=>[...r.querySelectorAll('[data-test-id],[role=button],[tabindex]')].map(e=>(e.getAttribute('data-test-id')||e.tagName)+'/'+(e.getAttribute('aria-label')||'')+'/'+e.innerText.trim().slice(0,20)).join(' ; ')));
const tip=async()=>p.evaluate(()=>[...document.querySelectorAll('.q-tooltip,.q-menu,[role=tooltip]')].filter(e=>e.offsetParent||e.getClientRects().length).map(e=>e.innerText.replace(/\s+/g,' | ')).join(' || '));
const icon=row.locator('[data-test-id*="credit"],[data-test-id*="info"],i:text("info"),.q-icon:has-text("info")').first(); console.log('icon',await icon.count());
if(await icon.count()){ const b=await icon.boundingBox(); console.log('ICONRECT',JSON.stringify(b));
 await p.screenshot({path:`../ev/${PF}-1-row.png`});
 await icon.hover(); await p.waitForTimeout(1200); console.log('HOVER',await tip()); await p.screenshot({path:`../ev/${PF}-2-hover.png`});
 await p.mouse.move(10,10); await p.waitForTimeout(1200); console.log('HOVER-LEAVE',await tip());
 await icon.click(); await p.waitForTimeout(1000); await p.mouse.move(10,10); await p.waitForTimeout(1200); console.log('CLICK-STAYS',await tip()); await p.screenshot({path:`../ev/${PF}-3-click.png`});
 await icon.click(); await p.waitForTimeout(1000); await p.mouse.move(10,10); await p.waitForTimeout(800); console.log('CLICK2',await tip());
 await icon.focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(1000); console.log('ENTER',await tip()); await p.keyboard.press('Escape'); await p.waitForTimeout(600);
 await icon.focus(); await p.keyboard.press('Space'); await p.waitForTimeout(1000); console.log('SPACE',await tip()); }
await s.close(); process.exit(0);
