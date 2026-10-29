// F4 filter recheck - screen side (29 Oct 2026). SECRET-FREE. Each mode = a FRESH boot2 browser context (storage empty except what
// boot2 itself writes: user, fe_permissions_wrapper, token, and the app's own localStorage['timezone']). Rule 99: process TZ, browser
// timezoneId, session change-location and the app timezone key all = the location's zone; all recorded in meta.json.
// Usage: TZ=<zone> node f4_screen.mjs <mode>     modes: notes-hd notes-leth ibs-hd ibs-leth qb-hd qb-leth d7
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const APP = 'https://app.staging.shopview.com';
const L = { hd: ['b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi', 'Staging Heavy Duty - 9919'], leth: ['f8a8b802-7780-4b16-bf10-343caeb616b2', 'America/Edmonton', 'Staging Lethbridge - 4310'],
  dvi: ['39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto', 'DVI Test'] };
const mode = process.argv[2]; const where = mode === 'd7' ? 'dvi' : mode.split('-')[1]; const [WP, TZ, LOCN] = L[where];
if (process.env.TZ !== TZ) { console.log('process TZ must be', TZ); process.exit(3); }
const OUT = `/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f4/${mode}`; fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await boot2('admin', { workplaceId: WP, timezone: TZ, contextOptions: { viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2, timezoneId: TZ, acceptDownloads: true } });
const meta = { mode, location: LOCN, location_tz: TZ, process_TZ: process.env.TZ, process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, observed_at_utc: new Date().toISOString(), shots: {}, notes: {}, requests: [], replies: [] };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
// The app's own location key (what the header location picker writes = the ticket's step 2). Without it a fresh context falls back to the
// USER's last-used location, which other workers' sessions keep changing (seen 29 Oct: qb-hd opened on DVI Test).
await page.evaluate(w => localStorage.setItem('location', JSON.stringify(w)), WP); meta.location_key_set = WP;
const API = /api\.staging\.shopview\.com\/api\/(notes|customers\/ibs|bookkeeping\/unexported|reporting\/export|users\/me\/preferences)/;
page.on('request', r => { const u = decodeURIComponent(r.url()); if (API.test(u)) meta.requests.push({ t: new Date().toISOString(), m: r.method(), u: u.replace(/^https:\/\/api\.staging\.shopview\.com/, '').slice(0, 500), loc: r.headers()['x-location-id'] || null }); });
page.on('response', async r => { const u = decodeURIComponent(r.url()); if (!API.test(u) || r.request().method() !== 'GET' || /reporting\/export/.test(u)) return; try { const j = await r.json(); const d = j?.data;
  const rec = { u: u.replace(/^https:\/\/api\.staging\.shopview\.com/, '').slice(0, 300), status: r.status() };
  if (d?.notes) { rec.n = d.notes.length; rec.pag = d.pagination; }
  if (d?.collection && Array.isArray(d.collection)) { rec.n = d.collection.length; rec.pag = d.pagination; const c = d.collection; if (c[0]?.typeLabel !== undefined) { rec.blank_by_type = {}; for (const i of c) if (!i.number) rec.blank_by_type[i.type] = (rec.blank_by_type[i.type] || 0) + 1; rec.types = {}; for (const i of c) rec.types[i.type] = (rec.types[i.type] || 0) + 1;
      rec.testvt1_cm_oct22 = c.filter(i => i.type === 'credit_memo_create' && i.customer === 'TestVT1' && String(i.date).startsWith('2026-10-22')).map(i => ({ ref: i.referenceId, number: i.number, date: i.date, err: (i.errorMessage || '').slice(0, 60) })); } }
  if (d?.response) { const x = d.response; rec.n = Array.isArray(x) ? x.length : x?.collection?.length; if (Array.isArray(x)) rec.batches = x.map(b => ({ date: b.created_at || b.date, amount: b.amount, balance: b.balance, n: b.transactions?.length, sum: Math.round(b.transactions.reduce((s, t) => s + t.amount, 0) * 100) / 100 + Math.round((b.credits || []).reduce((s, t) => s + (t.amount || 0), 0) * 100) / 100 }));
    else rec.zero = (x?.collection || []).filter(t => Math.abs(t.amount || 0) < 0.005).map(t => t.invoice_display_number); }
  meta.replies.push(rec); } catch {} });
const B = b => b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
const box = async l => B(await l.first().boundingBox().catch(() => null));
const txt = async l => (await l.first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
const storage = async () => page.evaluate(() => ({ local: Object.fromEntries(Object.keys(localStorage).map(k => [k, ['user', 'token', 'fe_permissions_wrapper'].includes(k) ? '(login data, not printed)' : String(localStorage.getItem(k)).slice(0, 200)])), session: Object.fromEntries(Object.keys(sessionStorage).map(k => [k, String(sessionStorage.getItem(k)).slice(0, 200)])), url: location.href }));
const save = () => fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
const shot = async (name, extra = {}) => { meta.app_timezone_key = await page.evaluate(() => localStorage.getItem('timezone')); await page.screenshot({ path: `${OUT}/${name}.png` }); meta.shots[name] = { ...extra, header: (await txt(page.locator('header'))).slice(0, 200), at_utc: new Date().toISOString() }; save(); };
const go = async (p, wait = 14000) => { meta.notes.storage_before_open = await storage(); await page.goto(APP + p, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(wait);
  meta.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null); meta.notes.storage_after_open = await storage(); meta.notes.header = (await txt(page.locator('header'))).slice(0, 200); };
const scrollNotes = async () => { let prev = -1; for (let i = 0; i < 90; i++) { await page.mouse.wheel(0, 5000); await page.waitForTimeout(350); if (i % 10 === 9) { const c = await page.locator('.note-item').count(); if (c === prev) break; prev = c; } } await page.waitForTimeout(4000); };
const pickRange = async label => { await page.getByText('Date Range', { exact: false }).first().click(); await page.waitForTimeout(1500);
  const menu = page.locator('.q-menu').last(); meta.notes.range_menu = (await menu.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
  await menu.getByText(label, { exact: true }).first().click(); await page.waitForTimeout(9000); await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(800); };
const notesState = async tag => { const r0 = meta.replies.length; await scrollNotes(); const last = page.locator('.note-item').last();
  await last.evaluate(e => e.scrollIntoView({ block: 'end' })).catch(() => {}); await page.waitForTimeout(1500);
  return { tag, url: page.url(), toolbar: (await txt(page.locator('main'))).slice(0, 260), cards: await page.locator('.note-item').count(), lastText: (await txt(last)).slice(0, 160),
    pager_or_load_more: await page.locator('.q-pagination, button:has-text("Load more"), button:has-text("Show more"), button:has-text("Next")').count(),
    end_message: await page.getByText(/no more|end of/i).count(), replies: meta.replies.slice(r0 - 1), lastBox: await box(last), chipBox: await box(page.getByText('Date Range', { exact: false })) }; };
try {
if (mode.startsWith('notes')) {
  await go('/reports/notes-report', 16000);
  meta.notes.left_menu = await page.evaluate(() => { const t = document.body.innerText; const i = t.search(/ACCOUNTING\s*\n/i); const j = t.search(/COMMUNICATIONS/i); return { accounting_to_end: i >= 0 ? t.slice(i, i + 200) : null, communications: j >= 0 ? t.slice(j, j + 160) : null }; });
  meta.notes.fresh = await notesState('fresh-default'); save();
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
  await shot('0-fresh-default-top', { chip: await box(page.getByText('Date Range', { exact: false })) });
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800);
  await pickRange('All'); meta.notes.all = await notesState('All'); save();
  await shot('1-all-bottom', { last: meta.notes.all.lastBox, chip: meta.notes.all.chipBox, lastText: meta.notes.all.lastText });
  if (mode === 'notes-hd') { await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(800); await pickRange('Last Week'); meta.notes.last_week = await notesState('Last Week'); save(); }
}
if (mode.startsWith('ibs')) {
  await go('/reports/batch-transactions', 15000);
  meta.notes.tabs = await txt(page.locator('.q-tabs')); meta.notes.active_tab = await txt(page.locator('.q-tab--active'));
  meta.notes.search_value = await page.locator('main input').first().inputValue().catch(() => null);
  meta.notes.ready_rows = (await page.locator('tbody tr').allInnerTexts().catch(() => [])).map(s => s.replace(/\s+/g, ' ').slice(0, 160));
  meta.notes.table_bottom = await txt(page.locator('.q-table__bottom')); meta.notes.heads = await page.locator('thead th').allInnerTexts().catch(() => []);
  save();
  if (mode === 'ibs-leth') {
    await page.getByText('Sent', { exact: true }).first().click(); await page.waitForTimeout(8000);
    meta.notes.sent_url = page.url(); meta.notes.sent_bottom = await txt(page.locator('.q-table__bottom'));
    meta.notes.sent_rows = (await page.locator('tbody tr').allInnerTexts().catch(() => [])).map(s => s.replace(/\s+/g, ' ').slice(0, 200));
    const row = page.locator('tr').filter({ hasText: 'Oct 2, 2026' }).first();
    await row.getByText('expand_more').first().click().catch(async () => { await row.click(); }); await page.waitForTimeout(6000);
    meta.notes.expanded = (await page.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 2500);
  }
}
if (mode.startsWith('qb')) {
  await go('/reports/unexported-items', 16000);
  await page.locator('header').getByText(/Staging|DVI Test|QB Location/).last().click().catch(() => {}); await page.waitForTimeout(2000);
  meta.notes.location_switcher = (await page.locator('.q-menu').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 600); await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(1000);
  meta.notes.tabs = await txt(page.locator('.q-tabs')); meta.notes.active_tab = await txt(page.locator('.q-tab--active'));
  meta.notes.toolbar = (await txt(page.locator('main'))).slice(0, 300); meta.notes.heads = await page.locator('thead th').allInnerTexts().catch(() => []);
  await page.mouse.move(1000, 600);
  for (let i = 0; i < 120; i++) { const n = meta.replies.length; await page.mouse.wheel(0, 3000); await page.waitForTimeout(500); if (i > 20 && i % 10 === 0 && meta.replies.length === n && await page.locator('.q-table__bottom, tbody').last().isVisible()) { /* keep going a bit */ } }
  await page.waitForTimeout(3000);
  meta.notes.table_bottom = await txt(page.locator('.q-table__bottom'));
  const cm = page.locator('tbody tr').filter({ hasText: 'Credit Memo Create' });
  meta.notes.cm_rows_in_dom = await cm.count();
  meta.notes.cm_sample_cells = await cm.first().evaluate(tr => [...tr.querySelectorAll('td')].map(td => td.innerText.trim())).catch(() => null);
  const tv = page.locator('tbody tr').filter({ hasText: 'TestVT1' }).filter({ hasText: 'Credit Memo Create' });
  meta.notes.testvt1_cm_rows_in_dom = await tv.evaluateAll(trs => trs.map(tr => [...tr.querySelectorAll('td')].map(td => td.innerText.trim().slice(0, 70))));
  save();
}
if (mode === 'd7') {
  await go('/reports/sales', 14000);
  await page.getByText('Export Reports', { exact: true }).first().click(); await page.waitForTimeout(2500);
  const dlg = page.locator('.q-dialog').last(); meta.notes.dialog_fresh = await txt(dlg);
  await dlg.locator('[data-test-id="select_report_name"]').click(); await page.waitForTimeout(1000);
  await page.locator('.q-menu .q-item').filter({ hasText: 'Customer Invoice' }).first().click(); await page.waitForTimeout(800);
  meta.notes.dialog_after_report = await txt(dlg); meta.exports = {};
  for (const range of ['Yesterday', 'This Week', 'This Month']) {
    await dlg.locator('[data-test-id="select_date_range"]').click(); await page.waitForTimeout(1000);
    meta.notes.range_options = await page.locator('.q-menu .q-item').allInnerTexts();
    await page.locator('.q-menu .q-item').filter({ hasText: new RegExp('^\\s*(check\\s*)?' + range + '\\s*$') }).first().click(); await page.waitForTimeout(800);
    meta.notes['dialog_' + range] = await txt(dlg); save();
    const dlP = page.waitForEvent('download', { timeout: 150000 });
    await dlg.getByRole('button', { name: 'Export' }).click();
    const dl = await dlP; const fn = `${OUT}/${range.replace(' ', '_')}-${dl.suggestedFilename()}`; await dl.saveAs(fn);
    const lines = fs.readFileSync(fn, 'utf8').split(/\r?\n/);
    meta.exports[range] = { file: fn.split('/').pop(), lines: lines.length - 1, header: lines[0].slice(0, 300), s1_38216: lines.filter(l => /^"?S1-38216"?,/.test(l)).map(l => l.slice(0, 300)) }; save();
    await page.waitForTimeout(2500);
    if (!(await dlg.isVisible().catch(() => false))) { await page.getByText('Export Reports', { exact: true }).first().click(); await page.waitForTimeout(2500);
      await dlg.locator('[data-test-id="select_report_name"]').click(); await page.waitForTimeout(1000); await page.locator('.q-menu .q-item').filter({ hasText: 'Customer Invoice' }).first().click(); await page.waitForTimeout(800); }
  }
  await go('/workorders/37fa09a3-7317-4097-bef4-7ab894c40156/lines', 12000);
  await page.getByText('Finance', { exact: true }).first().click(); await page.waitForTimeout(9000);
  meta.notes.finance = (await txt(page.locator('main'))).slice(0, 1500);
}
} finally { meta.header_end = (await txt(page.locator('header'))).slice(-60); meta.header_ok = (meta.notes.header || '').includes(LOCN) && meta.header_end.includes(LOCN); save(); console.log(JSON.stringify({ mode, v: meta.appVersion, browser_zone: meta.browser_zone, process_zone: meta.process_zone, app_tz: meta.app_timezone_key, header_ok: meta.header_ok, header_end: meta.header_end }).slice(0, 600)); await browser.close(); }
