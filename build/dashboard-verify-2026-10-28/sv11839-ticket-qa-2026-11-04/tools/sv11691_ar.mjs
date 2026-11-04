// sv11691_ar.mjs — SV-11691 step 3: A/R Aging Detail (91+ bucket, S2-8650) and A/R Aging Summary (Wellington Truck Repair total). Heavy Duty, TZ=America/Edmonton. SECRET-FREE.
import fs from 'fs';
import { boot, finish, shot, sleep, LOC, APP, OUT } from './common.mjs';
const loc = LOC.HD; const T = 'SV-11691';
const { browser, page, rule99, app_version } = await boot(loc, { dest: '/reports/ar-aging-detail' });
const P = { app_version, rule99_start: rule99 };
await page.goto(APP + '/reports/ar-aging-detail', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(12000);
P.detail_filters = (await page.locator('main').innerText()).split('\n').filter(l => /Date|As of|Location|Customer/i.test(l)).slice(0, 6);
const grp = page.getByText(/91 or more days past due/).first(); await grp.click().catch(() => {}); await sleep(5000);
let rows = (await page.locator('tr').allInnerTexts()).map(x => x.replace(/\s+/g, ' ').trim());
P.detail_wellington = rows.filter(r => /Wellington/.test(r)); P.detail_s2_8650 = rows.filter(r => /S2-8650/.test(r));
const r = page.locator('tr').filter({ hasText: 'S2-8650' }).first(); if (await r.count()) { await r.scrollIntoViewIfNeeded(); await sleep(800); }
const b = await r.boundingBox().catch(() => null); P.detail_row_box = b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
P.pic_detail = await shot(page, T, '4-ar-aging-detail-91plus-S2-8650');
await page.goto(APP + '/reports/ar-aging-summary', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(12000);
rows = (await page.locator('tr').allInnerTexts()).map(x => x.replace(/\s+/g, ' ').trim());
P.summary_heads = (await page.locator('thead th').allInnerTexts()).map(x => x.replace(/\s+/g, ' ').replace(/arrow_drop_(up|down)/g, '').trim());
P.summary_wellington = rows.filter(r => /Wellington Truck Repair/.test(r));
const r2 = page.locator('tr').filter({ hasText: 'Wellington Truck Repair' }).first(); if (await r2.count()) { await r2.scrollIntoViewIfNeeded(); await sleep(800); }
const b2 = await r2.boundingBox().catch(() => null); P.summary_row_box = b2 && { x: Math.round(b2.x * 2), y: Math.round(b2.y * 2), w: Math.round(b2.width * 2), h: Math.round(b2.height * 2) };
P.pic_summary = await shot(page, T, '5-ar-aging-summary-wellington');
P.rule99_end = await finish(page, loc, rule99);
fs.writeFileSync(`${OUT}/${T}/evidence-ar.json`, JSON.stringify({ ticket: T, ...P }, null, 1));
console.log(JSON.stringify({ f: P.detail_filters, dw: P.detail_wellington.slice(0, 4), d: P.detail_s2_8650, sh: P.summary_heads, s: P.summary_wellington, r99: P.rule99_end.all_match }));
await browser.close();
