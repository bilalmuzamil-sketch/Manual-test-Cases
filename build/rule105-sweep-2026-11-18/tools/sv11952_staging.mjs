// SV-11952 staging half: Sales By Representative, Last month (October), Location: All locations, Viktoria Videnovic expanded.
// Stored invoice timestamps (the rows the screen received) -> day in the location's zone (machine tz db) -> screen order
// within each day, with all four zones recorded. Usage: TZ=<zone> node sv11952_staging.mjs HD|DVI
import { boot, rule99, LOC, sleep, save, dayIn, OUT } from './common.mjs';
import fs from 'fs';
const key = process.argv[2]; const loc = LOC[key]; const APP = 'https://app.staging.shopview.com';
const REP = '04fc7976-76b8-4b3e-97a5-6cfdb2f96f3c'; const SIX = ['S2-34681', 'S2-34864', 'S2-33689', 'S2-33735', 'S2-34873', 'S2-34874'];
const D = `${OUT}/SV-11952`; fs.mkdirSync(D, { recursive: true });
const r = await boot(loc); const page = r.page; page.setDefaultTimeout(30000);
const net = []; page.on('response', async q => { const u = q.url(); if (/sales-by-representative/.test(u)) { let b = null; try { b = await q.json(); } catch {} net.push({ u: decodeURIComponent(u.replace('https://api.staging.shopview.com', '')), b }); } });
await page.goto(APP + '/reports/sales-by-representative', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(10000);
await page.locator('[data-test-id="filter_chip_dateRange"]').click(); await sleep(1500);
await page.locator('.q-menu').last().getByText('Last month', { exact: true }).first().click(); await sleep(1000); await page.keyboard.press('Escape').catch(() => {}); await sleep(8000);
await page.locator('[data-test-id="filter_chip_locationIds"]').click(); await sleep(1500); await page.locator('[data-test-id="filter_select_all_locationIds"]').click(); await sleep(800); await page.keyboard.press('Escape').catch(() => {}); await sleep(9000);
await page.locator(`[data-test-id="button_sbr_expand_rep_${REP}"]`).click(); await sleep(10000);
const chips = await page.evaluate(() => [...document.querySelectorAll('[data-test-id^="filter_chip_"]')].map(e => e.innerText.replace(/\s+/g, ' ').trim()));
const rows = await page.evaluate(() => [...document.querySelectorAll('tbody tr')].map(t => t.innerText.replace(/\s+/g, ' ').trim()).filter(t => /^[A-Z][a-z]{2} \d{2} \d{4} [PS]\d*-\d+/.test(t)).map(t => { const m = t.match(/^([A-Z][a-z]{2} \d{2} \d{4}) ([PS]\d*-\d+)/); return { day: m[1], inv: m[2] }; }));
// screenshot centred on the Oct 07 group if present
const target = page.locator('tbody tr').filter({ hasText: 'S2-34681' }).first();
if (await target.count()) { await target.scrollIntoViewIfNeeded(); await sleep(800); }
await page.screenshot({ path: `${D}/sbr-${key}-viktoria-last-month.png` });
// stored rows (the invoices call for the rep)
const inv = net.filter(n => n.u.includes(`/${REP}/invoices`)).at(-1);
const coll = inv?.b?.data?.collection || inv?.b?.data || [];
const sampleKeys = Array.isArray(coll) && coll[0] ? Object.keys(coll[0]) : null;
const pickDate = o => o.created_on || o.invoiceDate || o.invoice_date || o.date || o.createdOn || o.created_at || o.invoicedAt || null;
const stored = (Array.isArray(coll) ? coll : []).filter(o => SIX.includes(o.invoiceNumber || o.invoice_number || o.number)).map(o => { const s = pickDate(o); return { inv: o.invoiceNumber || o.invoice_number || o.number, stored: s, location: o.locationName || o.location || null, day_here: s ? dayIn(s, loc.tz) : null, day_karachi: s ? dayIn(s, 'Asia/Karachi').day : null, day_toronto: s ? dayIn(s, 'America/Toronto').day : null }; });
// order check within each screen day: is it by invoice number ascending (numeric part after the prefix)?
const num = s => Number(s.split('-')[1]); const byDay = {}; rows.forEach(x => (byDay[x.day] ||= []).push(x.inv));
const days = Object.entries(byDay).filter(([, v]) => v.length > 1).map(([d, v]) => ({ day: d, shown: v, ascending_by_number: v.every((x, i) => i === 0 || num(v[i - 1]) <= num(x)) }));
const res = { ticket: 'SV-11952', location: loc.name, zone: loc.tz, rule99_start: r.rule99, chips, invoices_request: inv?.u?.slice(0, 260) || null, stored_row_keys: sampleKeys, six_stored: stored, screen_rows: rows.length, multi_invoice_days: days, picture: `SV-11952/sbr-${key}-viktoria-last-month.png`, rule99_end: await rule99(page, loc) };
save(`${D}/staging-${key}-${new Date().toISOString().slice(0, 16).replace(/:/g, '')}Z.json`, res);
console.log(JSON.stringify({ chips, req: res.invoices_request, keys: sampleKeys, six: stored.map(s => [s.inv, s.stored, s.day_here?.local, s.day_karachi, s.day_toronto]), days: days.filter(d => d.shown.some(x => SIX.includes(x)) || !d.ascending_by_number).slice(0, 8), n_multi: days.length, n_not_asc: days.filter(d => !d.ascending_by_number).length, z: res.rule99_end.all_zones_match, v: res.rule99_end.app_version }, null, 0));
await r.browser.close();
