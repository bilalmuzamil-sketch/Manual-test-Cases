// Screen reproduction, stage B (SECRET-FREE): Receive later on the ordered part; add the stocked part ZZAUTOTEST-PV1 qty 1 and Pick it.
import fs from 'fs';
import { open2, APP, box } from './ctx2.mjs';
const S = JSON.parse(fs.readFileSync('/tmp/cln/w3/seed.json')); const RID = process.argv[2];
const OUT = '/tmp/cln/w3/ui';
const { browser, page } = await open2('39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto', 2);
const log = []; let n = 10;
const shot = async (name, note) => { n++; await page.screenshot({ path: `${OUT}/B-${n}-${name}.png` }); log.push({ n, name, note }); console.log(n, name, note || ''); };
const posts = []; page.on('response', async r => { if (r.request().method() === 'POST' && r.url().includes('/api/') && !r.url().includes('sentry')) posts.push(`${r.status()} ${r.url().replace(/^.*\/api/, '')} ${(r.request().postData() || '').slice(0, 160)}`); });
await page.goto(`${APP}/workorders/${S.wo3}/lines`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
const row = page.locator('tr').filter({ has: page.locator(`[data-test-id="part_number_${RID}"]`) }).first();
const arrow = row.getByText('arrow_drop_down', { exact: true }).first();
await arrow.click(); await page.waitForTimeout(1500);
await shot('receive-menu', (await page.locator('.q-menu').last().innerText().catch(() => '')).replace(/\n/g, ' | '));
await page.locator('.q-menu').last().getByText(/Receive later/i).first().click(); await page.waitForTimeout(4000);
if (await page.locator('.q-dialog').count()) { log.push({ dlg: (await page.locator('.q-dialog').last().innerText()).replace(/\n+/g, ' | ').slice(0, 500) }); await shot('rl-dialog'); }
await shot('received-later', (await row.innerText().catch(() => '')).replace(/\s+/g, ' '));
// add the stocked part
await page.locator('[data-test-id="button_add_part"]').first().click(); await page.waitForTimeout(2000);
await page.locator('[data-test-id="select_inline_part_number"]').click(); await page.keyboard.type('ZZAUTOTEST-PV1', { delay: 50 }); await page.waitForTimeout(4000);
await page.locator(`[data-test-id="select_option_workorder_part_${S.inv1}-inventory_part"]`).click(); await page.waitForTimeout(2500);
await page.locator('[data-test-id="input_inline_part_quantity"]').fill('1');
await page.locator('[data-test-id="input_inline_part_sell_price"]').fill('30');
await shot('pv1-filled');
await page.locator('[data-test-id="button_save_inline_part"]').click(); await page.waitForTimeout(6000);
await page.keyboard.press('Escape'); await page.waitForTimeout(800);
const prow = page.locator('tr').filter({ hasText: 'ZZAUTOTEST-PV1' }).first();
log.push({ pv1row: (await prow.innerText().catch(() => '')).replace(/\s+/g, ' ') });
await prow.locator('[data-test-id="button_part_request_action"]').first().click(); await page.waitForTimeout(4000);
if (await page.locator('.q-dialog').count()) { log.push({ pickDlg: (await page.locator('.q-dialog').last().innerText()).replace(/\n+/g, ' | ').slice(0, 500) }); await shot('pick-dialog'); }
await shot('picked', (await page.locator('tr').filter({ hasText: 'ZZAUTOTEST-PV1' }).first().innerText().catch(() => '')).replace(/\s+/g, ' '));
fs.writeFileSync(`${OUT}/B.json`, JSON.stringify({ log, posts }, null, 1));
console.log(JSON.stringify({ log, posts }, null, 1).slice(0, 4000));
await browser.close();
