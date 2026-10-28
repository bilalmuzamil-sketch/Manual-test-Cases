// F2 reproduction #3 — entirely through the screen, step for step as the ticket's Steps to Reproduce will read.
// Work order S1-38199 (customer "ZZAUTOTEST Dash F2", DVI Test) already has line 1 from canned line 3x inspection.
// SECRET-FREE. Screenshots /tmp/cln/dv/ui3/NN-*.png, log /tmp/cln/dv/ui3/log.json
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const S = JSON.parse(fs.readFileSync('/tmp/cln/dv/seed.json'));
const WP = '39522bc6-abca-4f67-bd12-2840043c2d68', APP = 'https://app.staging.shopview.com', OUT = '/tmp/cln/dv/ui3';
fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await boot2('admin', { workplaceId: WP, timezone: 'America/Toronto' });
await page.evaluate(w => localStorage.setItem('location', JSON.stringify(w)), WP);
const log = []; let n = 0;
const shot = async (name, note) => { n++; const f = `${OUT}/${String(n).padStart(2, '0')}-${name}.png`; await page.screenshot({ path: f }); log.push({ step: n, name, note, url: page.url().replace(/^.*shopview.com/, '') }); console.log(n, name, note || ''); };
const posts = []; page.on('response', async r => { if (r.request().method() === 'POST' && r.url().includes('/api/')) posts.push(`${r.status()} ${r.url().replace(/^.*\/api/, '')}`); });
await page.goto(`${APP}/workorders/${S.wo_labels}/lines`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(9000);
await shot('lines-start', 'one line');
// New Line → canned line 3x inspection → Save & Close
await page.locator('button').filter({ hasText: /^New Line$/ }).first().click(); await page.waitForTimeout(2500);
const dlg = page.locator('.q-dialog').last();
await dlg.locator('.q-select').first().click(); await page.waitForTimeout(1200);
const opts = await page.locator('.q-menu .q-item').allInnerTexts();
log.push({ cannedOptions: opts.slice(0, 20) });
await page.locator('.q-menu .q-item').filter({ hasText: '3x inspection' }).first().click(); await page.waitForTimeout(1200);
await shot('new-line-dialog', 'picked 3x inspection');
await dlg.getByText(/Save & Close/i).first().click(); await page.waitForTimeout(5000);
await shot('two-lines', 'after Save & Close');
// Start / Stop on both lines
for (const i of [0, 1]) {
  await page.getByText('Start', { exact: true }).nth(0).click().catch(e => log.push({ startErr: e.message.split('\n')[0] }));
  await page.waitForTimeout(4000);
  await shot(`started-line-${i + 1}`, (await page.locator('button').allInnerTexts()).map(t => t.trim()).filter(t => /Stop|Pause|Clock Out|Finish/i.test(t)).join(','));
  await page.waitForTimeout(62000);
  const stop = page.locator('button').filter({ hasText: /^(Stop|Clock Out|Finish|Pause)$/ }).first();
  log.push({ stopLabel: await stop.innerText().catch(() => null) });
  await stop.click().catch(e => log.push({ stopErr: e.message.split('\n')[0] }));
  await page.waitForTimeout(3000);
  const dlg2 = page.locator('.q-dialog').last();
  if (await dlg2.count()) { log.push({ stopDialog: (await dlg2.innerText()).replace(/\n+/g, ' | ').slice(0, 300) }); await shot(`stop-dialog-${i + 1}`); const ok = dlg2.locator('button').filter({ hasText: /Save|Confirm|Stop|OK|Clock Out/i }).last(); if (await ok.count()) { await ok.click(); await page.waitForTimeout(3000); } }
  await shot(`stopped-line-${i + 1}`);
}
// Decline line 2 (line ⋮ menu → Decline)
const kebabs = page.getByText('more_vert', { exact: true });
await kebabs.nth(await kebabs.count() > 3 ? 3 : 2).click(); await page.waitForTimeout(1000);
log.push({ line2Menu: (await page.locator('.q-menu').last().innerText()).replace(/\n+/g, ' | ') });
await page.locator('.q-menu').last().getByText('Decline', { exact: true }).click(); await page.waitForTimeout(2500);
if (await page.locator('.q-dialog').count()) { log.push({ declineDialog: (await page.locator('.q-dialog').last().innerText()).replace(/\n+/g, ' | ').slice(0, 300) }); await shot('decline-dialog'); const ok = page.locator('.q-dialog').last().locator('button').filter({ hasText: /Decline|Confirm|Yes|OK|Save/i }).last(); if (await ok.count()) await ok.click(); await page.waitForTimeout(3000); }
await shot('line2-declined');
// Complete line 1
await page.locator('button').filter({ hasText: /^Complete$/ }).first().click().catch(e => log.push({ completeErr: e.message.split('\n')[0] })); await page.waitForTimeout(3000);
if (await page.locator('.q-dialog').count()) { log.push({ completeDialog: (await page.locator('.q-dialog').last().innerText()).replace(/\n+/g, ' | ').slice(0, 400) }); await shot('complete-dialog'); }
await shot('line1-complete');
fs.writeFileSync(`${OUT}/log.json`, JSON.stringify({ log, posts }, null, 1));
await browser.close();
