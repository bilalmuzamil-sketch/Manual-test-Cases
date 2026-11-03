// Probe 12 (read-only): Purchase Orders, Vendor Invoices, Vendors via the Parts left menu; open first row of each. Nothing saved.
import { start } from './lib.mjs';
import fs from 'fs';
const OUT = process.env.OUT;
const { r, page, dump, step, go } = await start(OUT);
const save = (n, o) => fs.writeFileSync(`${OUT}/${n}.json`, JSON.stringify(o, null, 1));
for (const [lab, n] of [['Purchase Orders', 'po'], ['Vendor Invoices', 'vinv'], ['Vendors', 'vendors'], ['Returns', 'returns']]) {
  await step(n, async () => { await go('/parts/inventory'); await page.locator(`text="${lab}"`).first().click(); await page.waitForTimeout(3000); await dump(n + '-list', true);
    save(n + '-buttons', await page.locator('main button:visible').allInnerTexts());
    await page.locator('main tbody tr').nth(1).click(); await page.waitForTimeout(3000); await dump(n + '-open', true); save(n + '-open-buttons', await page.locator('main button:visible').allInnerTexts()); });
}
await r.browser.close();
