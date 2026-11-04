// Probe 41 (read-only; windows closed unsaved): part row menu on the work order's Parts tab; New Part Request with a fresh special-order
// number; the edit control on a vendor bill line.
import { start } from '../../build-verify-sv10647-2026-11-03/probe/lib.mjs';
import fs from 'fs';
const OUT = process.env.OUT; const WO = 'https://sv10647.qa.shopview.com/workorders/56ea768d-c925-4f05-b165-16d89aec9cba';
const { r, page, step, go, dlg } = await start(OUT);
const open = async p => { for (let t = 0; t < 3 && !page.url().includes(p); t++) { await page.goto(WO + p); await page.waitForTimeout(5000); } };
await step('rowmenu', async () => { await open('/part-requests'); const mv = page.locator('main button:visible').filter({ has: page.locator('i:text-is("more_vert")') });
  const n = await mv.count(); for (let j = 1; j < n; j++) { await mv.nth(j).click(); await page.waitForTimeout(900); console.log('menu', j, JSON.stringify(await page.locator('.q-menu:visible').allInnerTexts())); await page.keyboard.press('Escape'); await page.waitForTimeout(300); } });
await step('special', async () => { await open('/lines'); await page.locator('main button:visible, main a:visible', { hasText: 'Add Part' }).first().click(); await page.waitForTimeout(1500);
  await page.locator('main button:visible', { hasText: 'More options' }).first().click(); await page.waitForTimeout(2500);
  const pn = dlg().locator('input:visible').first(); await pn.click(); const num = 'ZZSO' + Date.now().toString().slice(-6); await pn.pressSequentially(num, { delay: 120 }); await page.waitForTimeout(4000);
  console.log('special typed', num, JSON.stringify(await page.locator('.q-menu:visible').allInnerTexts())); await page.screenshot({ path: `${OUT}/special.png` }); await page.keyboard.press('Escape'); });
await step('vbill', async () => { await go('/parts/delivery/a3e969ca-1cff-4961-94a9-c5fa1a611e6a'); await page.waitForTimeout(4000);
  const icons = page.locator('main button:visible, main i:visible').filter({ hasText: /^edit_note$/ }); console.log('edit icons', await icons.count());
  await icons.last().click(); await page.waitForTimeout(2500); console.log('line edit', JSON.stringify(await page.locator('.q-dialog:visible').allInnerTexts()).slice(0, 900)); await page.screenshot({ path: `${OUT}/vbill-line.png` }); await page.keyboard.press('Escape'); });
await r.browser.close();
