// Probe 34 (read-only): Edit Inventory Part window and an opened vendor invoice on the new build.
import { start } from '../../build-verify-sv10647-2026-11-03/probe/lib.mjs';
const { r, page, step, go, search, dlg } = await start(process.env.OUT);
await step('editpart', async () => { await go('/parts/inventory'); await search('ZZAUTOTEST-PLBV-B'); await page.waitForTimeout(1500);
  const rows = page.locator('main tbody tr').filter({ hasText: 'ZZAUTOTEST' }); console.log('rows', await rows.count());
  if (!(await rows.count())) { await search('W3030T'); } await page.locator('main tbody tr td').filter({ hasText: /ZZAUTOTEST PLBV|3030 Standard Brake Chamber, 13/ }).first().click(); await page.waitForTimeout(2000);
  console.log('edit:', (await dlg().innerText()).replace(/\n+/g, ' | ').slice(0, 600)); await page.keyboard.press('Escape'); });
await step('vinv', async () => { await go('/parts/deliveries'); await page.waitForTimeout(3000); await page.locator('main tbody tr').nth(1).locator('td').nth(1).click(); await page.waitForTimeout(3500);
  console.log('vinv:', page.url(), (await page.locator('main').innerText()).replace(/\n+/g, ' | ').slice(0, 500)); });
await r.browser.close();
