// Probe 03: setup recipe walk on sv10647 — create throwaway part ZZAUTOTEST-PLBV-A (tracked), open it, set it inactive
// through the part window, find it on the Inactive tab, open Part History, open (and cancel) the bulk Deactivate parts flow.
// Test data only (ZZAUTOTEST). Labels read from screen.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT = process.env.OUT; fs.mkdirSync(OUT, { recursive: true });
const PN = 'ZZAUTOTEST-PLBV-A', DESC = 'ZZAUTOTEST PLBV PART A';
const r = await boot('sv10647', '/parts/inventory', 'admin'); const page = r.page;
let k = 0;
async function dump(name) { await page.waitForTimeout(2000); const n = String(++k).padStart(2, '0') + '-' + name;
  const dlg = page.locator('.q-dialog:visible, .q-menu:visible');
  const t = (await dlg.count()) ? (await dlg.allInnerTexts()).join('\n----\n') : (await page.locator('main').innerText().catch(() => ''));
  fs.writeFileSync(`${OUT}/${n}.txt`, page.url() + '\n' + t); await page.screenshot({ path: `${OUT}/${n}.png` }); console.log(n, page.url(), t.length); }
const step = async (n, f) => { try { await f(); return true; } catch (e) { console.log('FAIL', n, e.message.split('\n')[0].slice(0, 150)); await dump('FAIL-' + n); return false; } };
const fill = async (label, v) => { const f = page.locator('.q-dialog:visible').getByLabel(label, { exact: true }).first(); await f.fill(v); };
await page.waitForTimeout(3000);
if (process.env.CREATE) await step('new', async () => { await page.getByRole('button', { name: 'New Inventory Part' }).click(); await page.waitForTimeout(1500);
  await fill('Description', DESC); await fill('Part Number', PN); await fill('Cost', '10'); await fill('Sell Price', '20');
  const cat = page.locator('.q-dialog:visible').getByLabel('Category', { exact: true }).first(); await cat.click(); await page.waitForTimeout(1000);
  await page.locator('.q-menu:visible .q-item').first().click(); await page.waitForTimeout(500);
  await page.locator('.q-dialog:visible').getByLabel('Quantity', { exact: true }).first().fill('5');
  await dump('new-part-filled'); await page.locator('.q-dialog:visible').getByRole('button', { name: 'Save', exact: true }).click(); await page.waitForTimeout(3000); await dump('after-save'); });
await step('search', async () => { await page.locator('main').getByText('Search', { exact: true }).first().click(); await page.waitForTimeout(600); await page.locator('main input:visible').first().fill(PN); await page.waitForTimeout(2500); await dump('search-active'); });
await step('open', async () => { await page.locator('main td').filter({ hasText: DESC }).first().click(); await page.waitForTimeout(2500); await dump('part-window');
  const labs = await page.locator('.q-dialog:visible .q-field__label, .q-dialog:visible label, .q-dialog:visible button').allInnerTexts(); fs.writeFileSync(`${OUT}/part-window-labels.json`, JSON.stringify(labs, null, 1)); });
await step('status', async () => { await dump('part-status-area');
  const sel = page.locator('.q-dialog:visible').getByLabel(/Part Status/).first(); await sel.click(); await page.waitForTimeout(800); await dump('part-status-options');
  await page.locator('.q-menu:visible .q-item').filter({ hasText: 'Inactive' }).first().click(); await page.waitForTimeout(600);
  await page.locator('.q-dialog:visible').getByRole('button', { name: 'Save', exact: true }).last().click(); await page.waitForTimeout(1500); await dump('deactivate-confirm');
  await page.locator('.q-dialog:visible').getByRole('button', { name: 'Deactivate', exact: true }).last().click(); await page.waitForTimeout(3000); await dump('after-deactivate'); });
await step('inactive-tab', async () => { await page.keyboard.press('Escape'); await page.getByRole('tab', { name: 'Inactive' }).click(); await page.waitForTimeout(1500);
  await page.locator('main').getByText('Search', { exact: true }).first().click(); await page.waitForTimeout(600); await page.locator('main input:visible').first().fill(PN); await page.waitForTimeout(2500); await dump('inactive-tab-search'); });
await step('history', async () => { await page.locator('main tr').filter({ hasText: DESC }).locator('button, i').filter({ hasText: 'history' }).first().click(); await page.waitForTimeout(3000); await dump('part-history'); await page.goBack(); await page.waitForTimeout(2000); });
await step('bulk', async () => { await page.goto('https://sv10647.qa.shopview.com/parts/inventory'); await page.waitForTimeout(3000);
  await page.locator('main button:visible').filter({ has: page.locator('i:text-is("more_vert")') }).last().click(); await page.waitForTimeout(800); await dump('dots-menu');
  await page.locator('.q-menu:visible').getByText('Deactivate parts', { exact: true }).click(); await page.waitForTimeout(2000); await dump('bulk-deactivate-mode');
  const body = await page.locator('main').innerText(); fs.writeFileSync(`${OUT}/bulk-mode-main.txt`, body); });
await r.browser.close();
