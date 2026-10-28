// Clean evidence pictures (deviceScaleFactor 2) + element boxes for annotate_v2.py. SECRET-FREE.
import fs from 'fs';
import { open2, APP, box } from './ctx2.mjs';
const S = JSON.parse(fs.readFileSync('/tmp/cln/w3/seed.json'));
const OUT = '/tmp/cln/w3/ev'; fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await open2('39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto', 2, 2300, 1000);
const M = { observed_at_utc: new Date().toISOString() };
await page.goto(`${APP}/workorders/${S.wo3}/lines`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(11000);
M.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
const so1 = page.locator('tr').filter({ hasText: 'ZZAUTOTEST-SO1' }).first(); const pv1 = page.locator('tr').filter({ hasText: 'ZZAUTOTEST-PV1' }).first();
M.lines = { so1: await box(so1), pv1: await box(pv1), wo: await box(page.locator('[data-test-id="text_wo_number"]')), so1Text: (await so1.innerText().catch(() => '')).replace(/\s+/g, ' '), pv1Text: (await pv1.innerText().catch(() => '')).replace(/\s+/g, ' ') };
await page.screenshot({ path: `${OUT}/1-lines.png` });
await page.goto(`${APP}/workorders/${S.wo3}/finance`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(12000);
const so1i = page.getByText(/ZZAUTOTEST-SO1-10282011 - /).first();
await so1i.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(800);
M.invoice = { so1: await box(so1i), pv1: await box(page.getByText(/ZZAUTOTEST-PV1-10282011 - /).first()), partsTotal: await box(page.getByText('Parts Total').first()), title: await box(page.getByText(/Invoice: INV-/).first()) };
await page.screenshot({ path: `${OUT}/2-invoice.png` });
await page.goto(APP + '/reports/parts-velocity', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForSelector('[data-test-id="table_parts_velocity"]', { timeout: 90000 }); await page.waitForTimeout(8000);
const T = page.locator('[data-test-id="table_parts_velocity"]');
M.pv = { rows: (await T.locator('tbody tr').allInnerTexts()).map(t => t.replace(/\s*\n\s*/g, ' | ')).filter(Boolean), so1: await box(T.locator('tbody tr').filter({ hasText: 'ZZAUTOTEST-SO1' })), pv1: await box(T.locator('tbody tr').filter({ hasText: 'ZZAUTOTEST-PV1' })), so2: await box(T.locator('tbody tr').filter({ hasText: 'ZZAUTOTEST-SO2' })),
  hdr: { units: await box(page.locator('[data-test-id="header_pv_units_sold"]')), revenue: await box(page.locator('[data-test-id="header_pv_revenue"]')), demand: await box(page.locator('[data-test-id="header_pv_demand"]')), last: await box(page.locator('[data-test-id="header_pv_last_sale"]')) },
  datechip: await box(page.locator('.pv-filter-band button').first()) };
await page.screenshot({ path: `${OUT}/3-parts-velocity.png` });
fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(M, null, 1)); console.log(JSON.stringify(M, null, 1));
await browser.close();
