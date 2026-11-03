// Probe 27: throwaway special order on the probe-18 work order via the line menu "Request part"; reads every screen; Order if offered.
import { start } from './lib.mjs';
import fs from 'fs';
const OUT = process.env.OUT; const WO = JSON.parse(fs.readFileSync('probe/18/wo-url.json', 'utf8'));
const { r, page, step, dlg } = await start(OUT);
const save = (n, o) => fs.writeFileSync(`${OUT}/${n}.json`, JSON.stringify(o, null, 1));
let k = 0; const body = async n => { await page.waitForTimeout(1500); n = String(++k).padStart(2, '0') + '-' + n; const d = page.locator('.q-dialog:visible, .q-menu:visible'); const t = (await d.count()) ? (await d.allInnerTexts()).join('\n----\n') : await page.locator('main').innerText().catch(() => '');
  fs.writeFileSync(`${OUT}/${n}.txt`, page.url() + '\n' + t); await page.screenshot({ path: `${OUT}/${n}.png` }); console.log(n, t.length); };
await page.waitForTimeout(3000); for (let t = 0; t < 3 && !page.url().includes('/lines'); t++) { await page.goto(WO); await page.waitForTimeout(5000); }
await step('special', async () => {
  const icons = page.locator('main *:visible').filter({ hasText: /^more_vert$/ }).filter({ hasNot: page.locator('*') }); await icons.nth(1).click(); await page.waitForTimeout(900);
  await page.locator('.q-menu:visible').getByText('Request part', { exact: true }).click(); await page.waitForTimeout(2500); await body('request-part-window');
  const d = dlg(); const pn = d.locator('label').filter({ hasText: 'Part Number' }).locator('input').first(); await pn.click(); await page.waitForTimeout(500); await pn.pressSequentially('ZZAUTOTEST-PLBV-SO3', { delay: 60 }); await page.waitForTimeout(3500); await body('typed');
  save('menu', await page.locator('.q-menu:visible').allInnerTexts());
  await page.locator('.q-menu:visible .q-item').filter({ hasText: /special order|ZZAUTOTEST-PLBV-SO3/ }).first().click(); await page.waitForTimeout(1500); await body('picked');
  await d.locator('label').filter({ hasText: /^Description/ }).locator('input, textarea').first().fill('ZZAUTOTEST PLBV SPECIAL ORDER 3');
  await d.locator('label').filter({ hasText: /^Quantity/ }).locator('input').first().fill('1');
  const v = d.locator('label').filter({ hasText: /^Vendor/ }).last(); await v.click(); await page.waitForTimeout(2500); save('vendor-menu', (await page.locator('.q-menu:visible').allInnerTexts()).map(x => x.slice(0, 200)));
  await page.locator('.q-menu:visible .q-item').filter({ hasNotText: 'No results' }).first().click(); await page.waitForTimeout(800);
  await d.locator('label').filter({ hasText: /^\$?\s*Cost/ }).locator('input').first().fill('12').catch(() => {}); await d.locator('label').filter({ hasText: /Sell Price/ }).locator('input').first().fill('20').catch(() => {}); await body('filled');
  await d.locator('button:visible', { hasText: 'Save Part' }).first().click(); await page.waitForTimeout(4000); await body('saved');
  save('buttons', await page.locator('main button:visible').allInnerTexts());
  const o = page.locator('main button:visible', { hasText: /^Order$/ }); save('order-count', await o.count()); if (await o.count()) { await o.first().click(); await page.waitForTimeout(3500); await body('after-order'); save('buttons-after', await page.locator('main button:visible').allInnerTexts()); } });
await r.browser.close();
