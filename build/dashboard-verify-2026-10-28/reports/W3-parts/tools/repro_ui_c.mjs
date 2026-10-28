// Screen reproduction, stage C (SECRET-FREE): Complete line 1, Create Invoice, then read Parts Velocity.
import fs from 'fs';
import { open2, APP, box } from './ctx2.mjs';
const S = JSON.parse(fs.readFileSync('/tmp/cln/w3/seed.json')); const STAGE = process.argv[2] || 'C';
const OUT = '/tmp/cln/w3/ui';
const { browser, page } = await open2('39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto', 2);
const log = []; let n = STAGE === 'C' ? 20 : 40; const meta = {};
const shot = async (name, note) => { n++; await page.screenshot({ path: `${OUT}/${STAGE}-${n}-${name}.png` }); log.push({ n, name, note }); console.log(n, name, note || ''); };
const posts = []; page.on('response', async r => { if (r.request().method() === 'POST' && r.url().includes('/api/') && !r.url().includes('sentry')) posts.push(`${r.status()} ${r.url().replace(/^.*\/api/, '')} ${(r.request().postData() || '').slice(0, 160)}`); });
const dlgText = async () => (await page.locator('.q-dialog').last().innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 600);
if (STAGE === 'C') {
  await page.goto(`${APP}/workorders/${S.wo3}/lines`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
  await page.locator(`[data-test-id="button_action_complete_line_${S.line3}"]`).click(); await page.waitForTimeout(4000);
  if (await page.locator('.q-dialog').count()) { log.push({ completeDlg: await dlgText() }); await page.locator('.q-dialog input').first().fill('ZZTESTVINPV300001'); await shot('complete-dialog-vin'); await page.locator('.q-dialog').last().locator('button').filter({ hasText: /Finish Work Order/ }).click(); await page.waitForTimeout(6000); log.push({ afterFinish: await dlgText() }); }
  await shot('line-complete');
} else {
  // Stage D: reverse the invoice, then create it again
  await page.goto(`${APP}/workorders/${S.wo3}/finance`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(12000);
  await shot('finance-before-reverse');
  const ids = await page.evaluate(() => [...document.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')).filter(x => /invoice|menu|more|reverse/i.test(x)));
  log.push({ ids: [...new Set(ids)] });
  let opened = false;
  for (const sel of ['[data-test-id*="invoice_menu"]', '[data-test-id*="invoice_actions"]', '[data-test-id*="invoice"][data-test-id*="more"]']) {
    if (!opened && await page.locator(sel).count()) { await page.locator(sel).first().click(); await page.waitForTimeout(1500); opened = /Reverse/.test(await page.locator('.q-menu').last().innerText().catch(() => '')); }
  }
  if (!opened) { const kb = page.getByText('more_vert', { exact: true }); for (let i = 0; i < await kb.count() && !opened; i++) { await kb.nth(i).click().catch(() => {}); await page.waitForTimeout(900); opened = /Reverse/.test(await page.locator('.q-menu').last().innerText().catch(() => '')); if (!opened) { await page.keyboard.press('Escape'); await page.waitForTimeout(300); } } }
  log.push({ menu: (await page.locator('.q-menu').last().innerText().catch(() => '')).replace(/\n/g, ' | ') });
  await shot('invoice-menu');
  await page.locator('.q-menu').last().getByText('Reverse', { exact: true }).first().click(); await page.waitForTimeout(2500);
  log.push({ reverseDlg: await dlgText() }); await shot('reverse-dialog');
  await page.locator('.q-dialog').last().locator('button').filter({ hasText: /^\s*Reverse\s*$/ }).last().click(); await page.waitForTimeout(8000);
  await shot('reversed');
}
// Finance → Create Invoice
await page.goto(`${APP}/workorders/${S.wo3}/finance`, { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForSelector('[data-test-id="button_create_invoice"]', { timeout: 90000 }); await page.waitForTimeout(5000);
await page.locator('[data-test-id="button_create_invoice"]').click(); await page.waitForTimeout(5000);
if (/Missing Details/.test(await dlgText())) { await page.locator('.q-dialog input').first().fill('ZZTESTVINPV300001'); await page.locator('.q-dialog').last().locator('button').filter({ hasText: /Create Invoice/ }).click(); await page.waitForTimeout(8000); }
log.push({ afterCreateDlg: await dlgText() });
await shot('invoice-created-dialog');
await page.keyboard.press('Escape'); await page.waitForTimeout(1000);
if (await page.locator('.q-dialog').count()) { const x = page.locator('.q-dialog [data-test-id="button_close_dialog"]'); if (await x.count()) await x.last().click(); await page.waitForTimeout(1500); }
await page.waitForTimeout(4000);
meta.invoiceText = (await page.locator('.q-page').first().innerText().catch(() => '')).split('\n').filter(l => /ZZAUTOTEST|Total|Subtotal|S1-/.test(l)).slice(0, 30);
meta.invoiceBoxes = { so1: await box(page.getByText(/ZZAUTOTEST-SO1/).first()), pv1: await box(page.getByText(/ZZAUTOTEST-PV1/).first()) };
await shot('invoice');
// Parts Velocity
await page.goto(APP + '/reports/parts-velocity', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForSelector('[data-test-id="table_parts_velocity"]', { timeout: 90000 }); await page.waitForTimeout(8000);
if (!(await page.locator('input[placeholder*="Search"]').count())) { await page.locator('[data-test-id*="search"]').first().click().catch(() => {}); await page.waitForTimeout(800); }
await page.locator('input[placeholder*="Search"]').first().fill('ZZAUTOTEST'); await page.waitForTimeout(10000);
const T = page.locator('[data-test-id="table_parts_velocity"]');
meta.pvRows = (await T.locator('tbody tr').allInnerTexts()).map(t => t.replace(/\s*\n\s*/g, ' | ')).filter(Boolean);
meta.pvBoxes = { header: await box(T.locator('thead')), so1: await box(T.locator('tbody tr').filter({ hasText: 'ZZAUTOTEST-SO1' })), pv1: await box(T.locator('tbody tr').filter({ hasText: 'ZZAUTOTEST-PV1' })), demand: await box(page.locator('[data-test-id="header_pv_demand"]')), revenue: await box(page.locator('[data-test-id="header_pv_revenue"]')), units: await box(page.locator('[data-test-id="header_pv_units_sold"]')), datechip: await box(page.locator('.pv-filter-band button').first()) };
meta.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
meta.observed_at_utc = new Date().toISOString();
await shot('parts-velocity');
fs.writeFileSync(`${OUT}/${STAGE}.json`, JSON.stringify({ log, posts, meta }, null, 1));
console.log(JSON.stringify({ log, posts, meta }, null, 1).slice(0, 6000));
await browser.close();
