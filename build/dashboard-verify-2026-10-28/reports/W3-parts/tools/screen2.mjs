// Screen pass 2 with the location time zone set as the app sets it. PV default window + Type menu; IV past day.
import fs from 'fs';
import { open2, APP, box } from './ctx2.mjs';
const WP = '39522bc6-abca-4f67-bd12-2840043c2d68', TZ = 'America/Toronto', OUT = '/tmp/cln/w3/shots';
const { browser, page } = await open2(WP, TZ);
const R = { reqs: [] };
page.on('request', r => { const u = r.url(); if (/reports\/(parts-velocity|inventory-value)\?/.test(u)) R.reqs.push(decodeURIComponent(u.replace(/^.*\/api\//, ''))); });
await page.goto(APP + '/reports/parts-velocity', { waitUntil: 'domcontentloaded', timeout: 90000 });
await page.waitForSelector('[data-test-id="table_parts_velocity"]', { timeout: 90000 }); await page.waitForTimeout(10000);
const chips = page.locator('.pv-filter-band button, .pv-filter-band [role="button"]');
await chips.filter({ hasText: /Type:/ }).first().click(); await page.waitForTimeout(1200);
R.typeMenu = (await page.locator('.q-menu').last().innerText().catch(() => '')).split('\n').filter(Boolean);
await page.screenshot({ path: `${OUT}/pv-04-type-menu.png` });
await page.keyboard.press('Escape'); await page.waitForTimeout(600);
// search seeded parts
const mag = page.locator('[data-test-id*="page_search"], [data-test-id*="search"]').first();
if (!(await page.locator('input[placeholder*="Search"]').count())) { await mag.click().catch(() => {}); await page.waitForTimeout(800); }
await page.locator('input[placeholder*="Search"]').first().fill('ZZAUTOTEST'); await page.waitForTimeout(9000);
R.pv_rows = (await page.locator('[data-test-id="table_parts_velocity"] tbody tr').allInnerTexts()).map(t => t.replace(/\s*\n\s*/g, ' | ')).filter(Boolean);
const so1 = page.locator('[data-test-id="table_parts_velocity"] tbody tr').filter({ hasText: 'ZZAUTOTEST-SO1' });
const pv1 = page.locator('[data-test-id="table_parts_velocity"] tbody tr').filter({ hasText: 'ZZAUTOTEST-PV1' });
await page.screenshot({ path: `${OUT}/pv-05-seeded.png` });
R.boxes = { so1: await box(so1), pv1: await box(pv1), headers: await box(page.locator('[data-test-id="table_parts_velocity"] thead')), demandHdr: await box(page.locator('[data-test-id="header_pv_demand"]')), datechip: await box(chips.first()) };
// IV past day before the first nightly capture, via the URL the report itself syncs
await page.goto(APP + '/reports/inventory-value?asOfDate=2026-07-01', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(12000);
R.iv_past = (await page.locator('.q-page').first().innerText().catch(() => '')).split('\n').filter(Boolean).slice(0, 40);
await page.screenshot({ path: `${OUT}/iv-02-before-first-capture.png` });
await page.goto(APP + '/reports/inventory-value?asOfDate=2026-10-27', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(12000);
R.iv_d1 = (await page.locator('.q-page').first().innerText().catch(() => '')).split('\n').filter(Boolean).slice(0, 60);
await page.screenshot({ path: `${OUT}/iv-03-yesterday.png` });
fs.writeFileSync(`${OUT}/screen2.json`, JSON.stringify(R, null, 1));
console.log(JSON.stringify(R, null, 1).slice(0, 7000));
await browser.close();
