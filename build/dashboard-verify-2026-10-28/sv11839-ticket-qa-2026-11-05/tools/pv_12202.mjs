// pv_12202.mjs — SV-12202 read: Reports → Parts Velocity, Date Last 12 months, Location All, Search the seeded part, read Last Sale.
// Staging Heavy Duty - 9919, TZ=America/Edmonton. Steps adapted from rerun-2026-11-04/tools/sec3/screen_sec3.mjs mode 'pv' (proven). SECRET-FREE.
// Usage: node pv_12202.mjs <tag>
import fs from 'fs';
import { boot, finish, shot, sleep, LOC, APP } from '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-04/tools/common.mjs';
const OUT = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/sv11839-ticket-qa-2026-11-05'; const T = 'SV-12202'; const tag = process.argv[2];
const R = JSON.parse(fs.readFileSync('/tmp/cln/qa11839/seed.json', 'utf8')).PV12202;
const { browser, page: p, rule99, app_version } = await boot(LOC.HD, { dest: '/reports/parts-velocity' });
const go = async (u, w) => { await p.goto(APP + u, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(w); };
const txt = async l => (await l.first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
const E = { tag, app_version, rule99_start: rule99, part: R.cat.pn, wo: R.display, invoice_created_utc: R.invoice_created_utc };
await go('/reports/parts-velocity', 14000);
await p.evaluate(() => { for (const k of Object.keys(localStorage)) if (/parts-velocity/.test(k)) localStorage.removeItem(k); });
await go('/reports/parts-velocity', 14000);
const chips = () => p.locator('.q-page button, .q-page [role="button"]'); const menu = () => p.locator('.q-menu').last();
await chips().filter({ hasText: /Date:/ }).first().click(); await sleep(1500);
await menu().getByText('Last 12 months', { exact: true }).first().click(); await sleep(800);
{ const ap = menu().getByText(/^Apply$/); if (await ap.count()) await ap.first().click().catch(() => {}); }
await p.keyboard.press('Escape').catch(() => {}); await p.mouse.click(5, 700); await sleep(8000);
await chips().filter({ hasText: /Location/ }).first().click(); await sleep(1500);
{ const it = menu().getByText(/^(Select all|All locations)$/).first(); if (await it.count()) await it.click(); }
await sleep(800); await p.keyboard.press('Escape').catch(() => {}); await p.mouse.click(5, 700); await sleep(9000);
{ const inp = p.locator('.q-page input[placeholder*="Search" i]').filter({ visible: true });
  if (!(await inp.count())) { await p.locator('.q-page button').filter({ hasText: 'Search' }).first().click().catch(() => {}); await sleep(1200); }
  const foc = await p.evaluate(() => document.activeElement && document.activeElement.tagName);
  if (foc === 'INPUT') await p.keyboard.type(R.cat.pn); else await p.locator('.q-page input').filter({ visible: true }).first().fill(R.cat.pn); await sleep(8000); }
E.chips = (await chips().allInnerTexts()).map(x => x.replace(/\s+/g, ' ').trim()).filter(x => /Date:|Location/.test(x));
const row = p.locator('tbody tr').filter({ hasText: R.cat.pn });
E.heads = await p.locator('thead th').evaluateAll(t => t.map(x => x.innerText.replace(/\s+/g, ' ').replace(/arrow_\w+|info_outline/g, '').trim()).filter(Boolean));
E.cells = await row.first().locator('td').allInnerTexts().catch(() => []);
const li = E.heads.findIndex(h => /Last Sale/.test(h)); E.last_sale = li >= 0 ? E.cells[li] : null;
E.read_utc = new Date().toISOString(); E.location_local_time_2026e = new Date().toLocaleString('en-US', { timeZone: 'America/Edmonton' });
await p.locator('.q-table__middle, .q-table__container .scroll').first().evaluate(e => { e.scrollLeft = e.scrollWidth; }).catch(() => {}); await sleep(1000);
const b = await row.first().boundingBox().catch(() => null); E.row_box = b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
E.pic = await shot(p, T, `pv-last-sale-${tag}`);
E.rule99_end = await finish(p, LOC.HD, rule99);
fs.mkdirSync(`${OUT}/${T}`, { recursive: true }); fs.writeFileSync(`${OUT}/${T}/pv-${tag}.json`, JSON.stringify(E, null, 1));
console.log(JSON.stringify({ tag, chips: E.chips, last_sale: E.last_sale, heads: E.heads.slice(-4), cells: E.cells.slice(-4), read_utc: E.read_utc, local: E.location_local_time_2026e, v: app_version, r99: E.rule99_end.all_match }));
await browser.close();
