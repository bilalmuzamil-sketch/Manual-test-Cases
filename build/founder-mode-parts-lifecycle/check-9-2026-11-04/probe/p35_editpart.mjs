// Probe 35 (read-only): Edit Inventory Part window on the new build (opened, then closed).
import { start } from '../../build-verify-sv10647-2026-11-03/probe/lib.mjs';
const { r, page, step, go, dlg } = await start(process.env.OUT);
await step('editpart', async () => { await go('/parts/inventory?search=W3030T'); await page.waitForTimeout(3000);
  await page.locator('main tbody tr td').filter({ hasText: '3030 Standard Brake Chamber, 13' }).first().click(); await page.waitForTimeout(2000);
  console.log('edit:', (await dlg().innerText()).replace(/\n+/g, ' | ').slice(0, 700)); await page.keyboard.press('Escape'); });
await r.browser.close();
