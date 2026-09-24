// With BOTH Require ordering parts and Require picking inventory parts OFF, look for an Order / Pick action
// on the part row, in the part's ... menu, and in the bulk bar. Serves C44551(3), C44552(1), C44603.
// Positive control first: the ... menu must open and list SOMETHING, or the reading proves nothing (Rule 104).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo, bodyText } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const ID = process.argv[2], TAG = process.argv[3];
const { browser, page } = await bootProdLogin('/workorders', { settle: 9000 });
page.setDefaultTimeout(20000);
await openWo(page, ID);

const report = { wo: TAG, url: page.url(), rowText: null, menus: [] };
// the part rows sit under the "Parts" block; their menu button is the more_vert next to each part
const menuBtns = page.locator('.q-table tr:has-text("(") button:has-text("more_vert"), tr button:has-text("more_vert"), [class*=part] button:has-text("more_vert")');
let count = await page.locator('button:has-text("more_vert"), .q-btn:has-text("more_vert")').count();
console.log('more_vert buttons on the page:', count);
const all = page.locator('button:has-text("more_vert"), .q-btn:has-text("more_vert")');
for (let i = 0; i < Math.min(count, 8); i++) {
  try {
    await all.nth(i).click({ timeout: 8000 });
    await page.waitForTimeout(2500);
    const items = await page.evaluate(() => [...document.querySelectorAll('.q-menu .q-item, [role=menu] [role=menuitem], .q-menu [clickable]')]
      .map(e => (e.innerText || '').trim().replace(/\s+/g, ' ')).filter(Boolean));
    report.menus.push({ index: i, items });
    console.log(`menu#${i}:`, JSON.stringify(items));
    await page.keyboard.press('Escape'); await page.waitForTimeout(1200);
  } catch (e) { console.log(`menu#${i} could not open:`, e.message.split('\n')[0]); report.menus.push({ index: i, error: e.message.split('\n')[0] }); }
}
report.rowText = (await bodyText(page)).slice(0, 6000);
fs.writeFileSync(`${EV}/${TAG}-part-menus.json`, JSON.stringify(report, null, 1));
await page.screenshot({ path: `${EV}/${TAG}-part-menus.png`, fullPage: true });
await browser.close();
