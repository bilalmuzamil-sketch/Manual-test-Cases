// Probe 16 (read-only): New Line on work order S2-6761 (opened from the Estimates tab), screenshot before and after; closed without saving.
import { start } from './lib.mjs';
import fs from 'fs';
const OUT = process.env.OUT;
const { r, page, step, go, dlg } = await start(OUT);
const body = async n => { await page.waitForTimeout(1500); fs.writeFileSync(`${OUT}/${n}.txt`, page.url() + '\n' + await page.locator('body').innerText()); await page.screenshot({ path: `${OUT}/${n}.png` }); console.log(n, page.url()); };
await step('nl', async () => { await go('/workorders?tab=estimate'); await page.waitForTimeout(2000); await page.locator('main td').filter({ hasText: 'S2-6761' }).first().click(); await page.waitForTimeout(4500); await body('wo');
  const b = page.locator('button:visible', { hasText: 'New Line' }); console.log('newline buttons', await b.count()); await b.first().click(); await page.waitForTimeout(3000); await body('after-new-line');
  console.log('dialogs', await page.locator('.q-dialog:visible').count());
  const t = page.locator('.q-dialog:visible input:visible').first(); await t.click(); await page.keyboard.type('Re', { delay: 80 }); await page.waitForTimeout(2500); await body('typed');
  fs.writeFileSync(`${OUT}/menu.json`, JSON.stringify(await page.locator('.q-menu:visible').allInnerTexts()));
  await page.keyboard.press('Escape'); await page.waitForTimeout(500); await page.locator('.q-dialog:visible button:visible').filter({ hasText: 'close' }).first().click().catch(() => {}); await page.waitForTimeout(1000); await body('closed'); });
await r.browser.close();
