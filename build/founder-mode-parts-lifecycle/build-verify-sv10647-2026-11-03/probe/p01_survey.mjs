// Probe 01 (read-only survey): visible text + screenshot of each Parts Lifecycle screen on sv10647. Nothing is saved.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT = process.env.OUT; fs.mkdirSync(OUT, { recursive: true });
const r = await boot('sv10647', '/parts/inventory', 'admin'); const page = r.page;
const A = 'https://sv10647.qa.shopview.com';
async function dump(name) { await page.waitForTimeout(2500); const t = await page.locator('body').innerText();
  fs.writeFileSync(`${OUT}/${name}.txt`, page.url() + '\n' + t); await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false }); console.log(name, page.url(), t.length); }
async function go(p, n) { await page.goto(A + p, { waitUntil: 'domcontentloaded' }); await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {}); await dump(n); }
await go('/parts/inventory', '01-inventory-active');
try { await page.getByRole('tab', { name: 'Inactive' }).click(); await dump('02-inventory-inactive'); } catch (e) { console.log('no Inactive tab role', e.message.slice(0, 80)); }
try { await page.getByRole('tab', { name: 'Active', exact: true }).click(); await page.waitForTimeout(1000);
  const dots = page.locator('main button:visible').filter({ has: page.locator('i:text-is("more_vert")') });
  console.log('dots', await dots.count()); await dots.last().click(); await dump('03-inventory-menu'); await page.keyboard.press('Escape'); } catch (e) { console.log('menu', e.message.slice(0, 80)); }
try { await page.getByRole('button', { name: /New Inventory Part/ }).first().click(); await dump('04-new-part-dialog');
  const labels = await page.locator('.q-dialog label:visible, .q-dialog .q-field__label:visible, .q-dialog .q-toggle:visible, .q-dialog .q-checkbox:visible').allInnerTexts();
  fs.writeFileSync(`${OUT}/04-new-part-dialog-labels.json`, JSON.stringify(labels, null, 1)); await page.keyboard.press('Escape'); } catch (e) { console.log('newpart', e.message.slice(0, 80)); }
await go('/parts/parts-catalogue', '05-part-library');
await go('/parts/part-sales', '06-part-sales');
await go('/reports/inventory-value', '07-inventory-value');
await go('/settings', '08-settings');
await go('/settings/inventory-import', '09-inventory-import');
await go('/settings/roles', '10-roles');
fs.writeFileSync(`${OUT}/version.txt`, await page.locator('meta[name="app-version"]').getAttribute('content'));
await r.browser.close();
