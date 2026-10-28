// Click "Create Invoice" on a work order's Finance tab through the screen (DVI Test), confirming any dialog. SECRET-FREE.
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const [wo, tag] = process.argv.slice(2);
const WP = '39522bc6-abca-4f67-bd12-2840043c2d68', TZ = 'America/Toronto', OUT = '/tmp/cln/w2/ev2';
const { browser, page } = await boot2('admin', { workplaceId: WP, timezone: TZ });
await page.evaluate(([w, z]) => { localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(z)); }, [WP, TZ]);
const log = []; page.on('response', async r => { if (r.request().method() === 'POST' && /\/api\//.test(r.url())) { try { log.push({ u: r.url().replace(/^.*\/api/, ''), s: r.status(), b: (await r.text()).slice(0, 160) }); } catch {} } });
await page.goto(`https://app.staging.shopview.com/workorders/${wo}/finance`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(9000);
console.log('url', page.url(), JSON.stringify((await page.locator('button').allInnerTexts()).filter(t => t.trim()).slice(0, 30))); await page.screenshot({ path: `${OUT}/inv-${tag}-before.png` }); const bi = await page.locator('button').evaluateAll(es => es.findIndex(e => e.innerText.trim() === 'Create Invoice')); console.log('btn idx', bi); await page.locator('button').nth(bi).click({ timeout: 20000 }); await page.waitForTimeout(3500);
for (let i = 0; i < 3; i++) {
  const dlg = page.locator('.q-dialog').last();
  if (!(await dlg.count())) break;
  const t = (await dlg.innerText().catch(() => '')).replace(/\n+/g, ' / ');
  console.log('dialog', i, t.slice(0, 500));
  await page.screenshot({ path: `${OUT}/inv-${tag}-dialog${i}.png` });
  const ok = dlg.locator('[data-test-id="button_confirm_dialog"]');
  if (await ok.count()) await ok.click(); else await dlg.locator('button').filter({ hasText: /Create|Confirm|Yes|OK|Continue|Complete/i }).last().click();
  await page.waitForTimeout(5000);
}
await page.goto(`https://app.staging.shopview.com/workorders/${wo}/finance`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(8000);
console.log('finance after', (await page.locator('main, .q-page').first().innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 700));
await page.screenshot({ path: `${OUT}/inv-${tag}-after.png` });
console.log('posts', JSON.stringify(log).slice(0, 1200));
await browser.close();
