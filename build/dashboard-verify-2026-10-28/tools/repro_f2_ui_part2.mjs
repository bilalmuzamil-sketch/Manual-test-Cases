// F2 reproduction #3, part 2 (screen only): Approve line 2 → Start/Clock Out on line 2 → line 2 ⋮ Decline →
// line 1 Complete → Finance → Create Invoice → Dashboard + report readings. SECRET-FREE. Screens in /tmp/cln/dv/ui3/.
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const S = JSON.parse(fs.readFileSync('/tmp/cln/dv/seed.json'));
const WP = '39522bc6-abca-4f67-bd12-2840043c2d68', APP = 'https://app.staging.shopview.com', OUT = '/tmp/cln/dv/ui3';
const { browser, page } = await boot2('admin', { workplaceId: WP, timezone: 'America/Toronto' });
await page.evaluate(w => localStorage.setItem('location', JSON.stringify(w)), WP);
const log = []; let n = 20;
const shot = async (name, note) => { n++; await page.screenshot({ path: `${OUT}/${n}-${name}.png` }); log.push({ step: n, name, note }); console.log(n, name, note || ''); };
const dash = []; page.on('response', async r => { if (r.url().includes('/api/dashboard/reports')) { try { dash.push(await r.json()); } catch {} } });
await page.goto(`${APP}/workorders/${S.wo_labels}/lines`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(9000);
await page.locator('button').filter({ hasText: /^Approve$/ }).first().click(); await page.waitForTimeout(3500);
if (await page.locator('.q-dialog').count()) { log.push({ approveDialog: (await page.locator('.q-dialog').last().innerText()).replace(/\n+/g, ' | ').slice(0, 300) }); await shot('approve-dialog'); }
await shot('line2-approved');
await page.getByText('Start', { exact: true }).nth(1).click(); await page.waitForTimeout(4000);
await shot('line2-started');
await page.waitForTimeout(62000);
await page.locator('button').filter({ hasText: /^Stop$/ }).first().click(); await page.waitForTimeout(2500);
await page.locator('.q-dialog').last().locator('button').filter({ hasText: /^Clock Out$/ }).click(); await page.waitForTimeout(3500);
await shot('line2-clocked-out');
const kb = page.locator('[data-test-id^="button_line_expand_"]');
log.push({ expandButtons: await kb.count() });
// line 2's row menu: the more_vert in line 2's header row
const row2 = page.locator('tr, div').filter({ hasText: /^\s*2\s*$/ }).first();
const kebabs = page.getByText('more_vert', { exact: true });
let opened = false;
for (let i = 0; i < await kebabs.count() && !opened; i++) {
  await kebabs.nth(i).click().catch(() => {}); await page.waitForTimeout(900);
  const t = await page.locator('.q-menu').last().innerText().catch(() => '');
  if (/Decline/.test(t)) { const b = await kebabs.nth(i).boundingBox(); log.push({ kebabIndex: i, y: b && b.y, menu: t.replace(/\n+/g, ' | ') }); if (b && b.y > 420) { opened = true; break; } }
  await page.keyboard.press('Escape'); await page.waitForTimeout(400);
}
await page.locator('.q-menu').last().getByText('Decline', { exact: true }).click(); await page.waitForTimeout(3000);
if (await page.locator('.q-dialog').count()) { log.push({ declineDialog: (await page.locator('.q-dialog').last().innerText()).replace(/\n+/g, ' | ').slice(0, 300) }); await shot('decline-dialog'); }
await shot('line2-declined');
await page.locator('button').filter({ hasText: /^Complete$/ }).first().click(); await page.waitForTimeout(3500);
if (await page.locator('.q-dialog').count()) { log.push({ completeDialog: (await page.locator('.q-dialog').last().innerText()).replace(/\n+/g, ' | ').slice(0, 400) }); await shot('complete-dialog'); }
await shot('line1-completed');
await page.getByText('Finance', { exact: true }).first().click(); await page.waitForTimeout(6000);
await shot('finance-before-invoice', (await page.locator('button').allInnerTexts()).filter(t => /Invoice/i.test(t)).join(','));
const ci = page.locator('[data-test-id="button_create_invoice"]');
if (await ci.count() && !(await ci.isDisabled())) { await ci.click(); await page.waitForTimeout(6000); await shot('invoice-created', (await page.locator('.q-dialog').last().innerText().catch(() => '')).slice(0, 80)); await page.keyboard.press('Escape'); await page.waitForTimeout(1500); }
else log.push({ createInvoice: 'not available', why: (await page.locator('body').innerText()).split('\n').filter(l => /review|complete|invoice/i.test(l)).slice(0, 8) });
await shot('finance-after');
fs.writeFileSync(`${OUT}/log2.json`, JSON.stringify(log, null, 1));
await browser.close();
