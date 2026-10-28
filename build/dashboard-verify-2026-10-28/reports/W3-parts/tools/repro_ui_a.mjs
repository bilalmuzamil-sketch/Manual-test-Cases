// Screen reproduction, stage A (SECRET-FREE): WO S1-38206 line 1 — make the stocked-part request a Vendor order,
// Order it, then Receive later. Shots /tmp/cln/w3/ui/A-*.png, log /tmp/cln/w3/ui/A.json
import fs from 'fs';
import { open2, APP, box } from './ctx2.mjs';
const S = JSON.parse(fs.readFileSync('/tmp/cln/w3/seed.json')); const RID = process.argv[2];
const OUT = '/tmp/cln/w3/ui'; fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await open2('39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto', 2);
const log = []; let n = 0;
const shot = async (name, note) => { n++; await page.screenshot({ path: `${OUT}/A-${String(n).padStart(2, '0')}-${name}.png` }); log.push({ n, name, note }); console.log(n, name, note || ''); };
const posts = []; page.on('response', async r => { if (r.request().method() === 'POST' && r.url().includes('/api/') && !r.url().includes('sentry')) posts.push(`${r.status()} ${r.url().replace(/^.*\/api/, '')} ${(r.request().postData() || '').slice(0, 200)}`); });
await page.goto(`${APP}/workorders/${S.wo3}/lines`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
await shot('lines', 'start');
await page.locator(`[data-test-id="part_number_${RID}"]`).hover();
await page.locator(`[data-test-id="button_edit_part_${RID}"]`).click({ force: true }); await page.waitForTimeout(3000);
await shot('edit-dialog');
await page.locator('.q-dialog [data-test-id="select_workorder_part_source"]').click(); await page.waitForTimeout(1200);
await shot('source-menu', (await page.locator('.q-menu').last().innerText()).replace(/\n/g, ' | '));
await page.locator('.q-menu').last().getByText(/Vendor/).first().click(); await page.waitForTimeout(1500);
await shot('source-vendor');
for (const [tid, txt] of [['select_part_category', 'HD-Filters'], ['select_part_vendor', '123 Cannabis']]) {
  await page.locator(`.q-dialog [data-test-id="${tid}"]`).click(); await page.waitForTimeout(800);
  await page.keyboard.type(txt, { delay: 40 }); await page.waitForTimeout(2500);
  await page.locator('.q-menu').last().locator('.q-item').filter({ hasText: txt }).first().click(); await page.waitForTimeout(1200);
}
await shot('category-vendor-set');
await page.locator('.q-dialog [data-test-id="button_workorder_part_save"]').click(); await page.waitForTimeout(5000);
if (await page.locator('.q-dialog').count()) { log.push({ dlg: (await page.locator('.q-dialog').last().innerText()).replace(/\n+/g, ' | ').slice(0, 500) }); await shot('after-vendor-dialog'); }
await shot('vendor-set', await page.locator(`[data-test-id="badge_part_status_${RID}"]`).innerText().catch(() => '?'));
const row = page.locator('tr').filter({ has: page.locator(`[data-test-id="part_number_${RID}"]`) });
log.push({ rowText: (await row.first().innerText()).replace(/\s+/g, ' ') });
await row.locator('[data-test-id="button_part_request_action"]').first().click(); await page.waitForTimeout(4000);
if (await page.locator('.q-dialog').count()) { log.push({ orderDlg: (await page.locator('.q-dialog').last().innerText()).replace(/\n+/g, ' | ').slice(0, 600) }); await shot('order-dialog'); }
await shot('ordered', await page.locator(`[data-test-id="badge_part_status_${RID}"]`).innerText().catch(() => '?'));
log.push({ rowText2: (await row.first().innerText().catch(() => '')).replace(/\s+/g, ' ') });
fs.writeFileSync(`${OUT}/A.json`, JSON.stringify({ log, posts }, null, 1));
console.log(JSON.stringify({ log, posts }, null, 1).slice(0, 4000));
await browser.close();
