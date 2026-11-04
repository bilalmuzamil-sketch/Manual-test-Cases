// Probe 33 (read-only): the empty throwaway entry ZZAUTOTEST-PLBV-D: Delete enabled? confirmation text; cancelled.
import { start } from '../../build-verify-sv10647-2026-11-03/probe/lib.mjs';
import fs from 'fs';
const OUT = process.env.OUT; const { r, page, step, go, search, dlg } = await start(OUT);
await step('d', async () => { await go('/parts/parts-catalogue'); await search('ZZAUTOTEST-PLBV-D'); await page.locator('main tbody tr.cursor-pointer').first().locator('td').nth(1).click(); await page.waitForTimeout(2500);
  console.log('detail:', (await page.locator('main').innerText()).replace(/\n+/g, ' | ').slice(0, 200));
  await page.locator('main i:visible', { hasText: 'edit_note' }).first().click(); await page.waitForTimeout(1500); const del = dlg().getByRole('button', { name: 'Delete', exact: true });
  console.log('enabled:', await del.isEnabled()); await page.screenshot({ path: `${OUT}/edit-unused.png` });
  await del.click(); await page.waitForTimeout(1500); console.log('confirm:', (await page.locator('.q-dialog:visible').last().innerText()).replace(/\n+/g, ' | '));
  await page.locator('.q-dialog:visible').last().getByRole('button', { name: 'Cancel', exact: true }).click(); });
await r.browser.close();
