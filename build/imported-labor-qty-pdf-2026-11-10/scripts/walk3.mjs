import {sess} from './common.mjs';
const s=await sess(); const p=s.page; const out='../ev/prod';
await s.go('/workorders'); await p.waitForTimeout(4000);
await p.click('[data-test-id="display_option_list"]'); await p.waitForTimeout(3000);
await p.locator('button:has-text("Status")').first().click(); await p.waitForTimeout(1500);
const imp=p.locator('.q-menu .q-checkbox:has-text("Imported")').first();
console.log('imported disabled?',await imp.getAttribute('aria-disabled'));
await p.screenshot({path:`${out}/walk-1-status-imported.png`});
await imp.click(); await p.waitForTimeout(3000); await p.keyboard.press('Escape'); await p.waitForTimeout(3000);
console.log('url',p.url());
const row=p.locator('text=ZZQTYPDF-P').first(); console.log('row',await row.count());
await p.screenshot({path:`${out}/walk-2-imported-list.png`});
if(await row.count()){ await row.click(); await p.waitForTimeout(6000); console.log('opened',p.url()); await p.screenshot({path:`${out}/walk-3-invoice.png`}); }
// restore: clear status filter and go back to board view
await s.go('/workorders'); await p.waitForTimeout(3000);
await p.locator('button:has-text("Status")').first().click(); await p.waitForTimeout(1000);
const clr=p.locator('.q-menu :text("Clear selection")').first(); if(await clr.count()) await clr.click(); await p.keyboard.press('Escape'); await p.waitForTimeout(1500);
await p.click('[data-test-id="display_option_board_view"]'); await p.waitForTimeout(2000); console.log('restored url',p.url());
await s.close(); process.exit(0);
