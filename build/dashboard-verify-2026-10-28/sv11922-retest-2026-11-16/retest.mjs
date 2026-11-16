// SV-11922 retest (16 Nov 2026): A/P "Past Due" for bills not yet due, on the ticket's own examples.
// LE as of 2026-10-29 (bill 976974 due Oct 31 -> expect -2; bills due Oct 30 -> -1); HD as of 2026-11-03 (bills due Nov 4 -> -1).
// Run: TZ=<zone> node retest.mjs LE|HD    Own session; nothing secret saved. Rows with vendor names are reduced to number/dates/pastDue.
import fs from 'fs'; import { boot, LOC, APP, sleep, rule99, save } from '../report-gaps-2026-11-16/tools/sboot.mjs';
const KEY = process.argv[2]; const loc = LOC[KEY]; const asOf = KEY === 'LE' ? '2026-10-29' : '2026-11-03';
const EV = new URL('./', import.meta.url).pathname; const API = 'https://api.staging.shopview.com/api';
const { browser, page } = await boot(loc, { viewport: { width: 1536, height: 864 } }); const out = { key: KEY, asOf, start: await rule99(page, loc) };
const get = p => page.evaluate(async ([A, p]) => { const r = await fetch(A + p, { credentials: 'include', headers: { Accept: 'application/json' } }); return { s: r.status, j: await r.json().catch(() => null) }; }, [API, p]);
const days = (a, b) => Math.round((Date.parse(a) - Date.parse(b)) / 864e5);
const base = `asOfDate=${asOf}&timezone=${encodeURIComponent(loc.tz)}&locations=${loc.id}`;
let rows = []; out.pages = [];
for (let pg = 1; pg < 40; pg++) { const cur = await get(`/reporting/reports/ap-aging-detail/buckets/current/rows?${base}&pagination[page]=${pg}&pagination[rowsPerPage]=100`);
  const c = cur.j?.data?.collection || cur.j?.data?.rows || []; out.pages.push([pg, cur.s, c.length]); rows = rows.concat(c); if (c.length < 100) break; }
out.current_status = out.pages.every(p => p[1] === 200) ? 200 : 'see pages';
out.row_keys = Array.isArray(rows) && rows[0] ? Object.keys(rows[0]) : JSON.stringify(cur.j).slice(0, 400);
const locDay = iso => new Intl.DateTimeFormat('en-CA', { timeZone: loc.tz }).format(new Date(iso));
const pick = r => { const due = r.dueDate ? locDay(r.dueDate) : ''; const pd = r.pastDue ?? r.past_due ?? r.daysPastDue;
  return { no: r.documentNumber, dueRaw: r.dueDate, due, pastDue: pd, expected: due ? days(asOf, due) : null, ok: due ? Number(pd) === days(asOf, due) : null }; };
out.current = Array.isArray(rows) ? rows.map(pick) : [];
out.ticket_examples = out.current.filter(x => x.no === '976974' || x.due === (KEY === 'LE' ? '2026-10-30' : '2026-11-04') || x.due === (KEY === 'LE' ? '2026-10-31' : '2026-11-05'));
out.current_summary = { rows: out.current.length, ok: out.current.filter(x => x.ok).length, wrong: out.current.filter(x => x.ok === false) };
// screen: narrow to the example row's vendor so the row is on the first screen
const ex = rows.find(r => r.documentNumber === (KEY === 'LE' ? '976974' : 'C44596-01726902')); out.example_vendorId = ex?.vendorId;
const un = await get(`/reporting/reports/ap-unpaid-invoices?${base}&vendorIds=${ex?.vendorId}&pagination[page]=1&pagination[rowsPerPage]=30`);
const docs = JSON.stringify(un.j || {}); out.unpaid_status = un.s;
const m = [...docs.matchAll(/"documentNumber":"([^"]+)"[^{}]*?"dueDate":"([^"]+)"[^{}]*?"daysPastDue":(-?\d+)/g)].map(x => ({ no: x[1], due: locDay(x[2]), pastDue: +x[3], expected: days(asOf, locDay(x[2])) }));
out.unpaid = { rows: m.length, ok: m.filter(x => x.pastDue === x.expected).length, example: m.find(x => x.no === ex?.documentNumber) || null, keys_sample: docs.slice(0, 300) };
for (const [slug, tag] of [['ap-aging-detail', 'detail'], ['ap-unpaid-invoices', 'unpaid']]) {
  await page.goto(`${APP}/reports/${slug}?asOfDate=${asOf}&locationIds=${loc.id}&vendorIds=${ex?.vendorId}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForLoadState('networkidle', { timeout: 40000 }).catch(() => {}); await sleep(8000);
  const t = page.getByText(ex?.documentNumber, { exact: true }).first();
  if (!(await t.count())) {
    const grp = tag === 'detail' ? page.locator('tr', { hasText: /Current \(/ }).first() : page.locator('tr', { hasText: ex?.vendorName || '@@' }).first();
    if (await grp.count()) { const chev = grp.locator('.q-icon, i, button').first(); await (await chev.count() ? chev : grp).click().catch(() => {}); await sleep(5000); }
    out['clicked_' + tag] = await grp.count(); }
  const row = page.locator('tr', { has: page.getByText(ex?.documentNumber, { exact: true }) }).first();
  out['screen_' + tag] = (await row.count()) ? (await row.innerText()).replace(/\s+/g, ' ').trim() : 'row not found';
  if (await row.count()) { await row.scrollIntoViewIfNeeded(); await sleep(600); out['screen_' + tag + '_box'] = await row.boundingBox(); }
  await page.screenshot({ path: EV + `screen-${KEY}-${tag}.png` });
}
out.end = await rule99(page, loc); save(EV + `retest-${KEY}.json`, out); await browser.close();
console.log(KEY, asOf, 'status', out.current_status, JSON.stringify(out.current_summary).slice(0, 300), '| examples', JSON.stringify(out.ticket_examples).slice(0, 700), '| screen detail:', out.screen_detail, '| screen unpaid:', out.screen_unpaid, '| unpaid', JSON.stringify(out.unpaid).slice(0,400), '| keys', JSON.stringify(out.row_keys).slice(0, 300));
