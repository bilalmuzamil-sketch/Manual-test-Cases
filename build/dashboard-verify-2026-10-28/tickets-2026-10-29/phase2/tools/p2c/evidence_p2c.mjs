// Worker p2c evidence (Phase 2, Sales By Representative / Sales Tax Collected). Rule 99: browser timezoneId = the
// location's zone, process TZ = the same zone, session change-location'd by boot2; all three + app version recorded in
// meta.json. deviceScaleFactor 2 so boxes feed annotate_v2.py. SECRET-FREE. Out: /tmp/cln/p2c/ev/<mode>/
// Usage: TZ=<zone> node evidence_p2c.mjs <mode>   modes: dep | zero | tax | sbr-before | edit | stats | sbr-after | sbr-order | tax-cm | cm-customer
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const APP = 'https://app.staging.shopview.com';
const LOC = { dvi: ['39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto', 'DVI Test'], hd: ['b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi', 'Staging Heavy Duty - 9919'] };
const mode = process.argv[2]; const [WP, TZ, LNAME] = LOC[/^(tax-cm|cm-customer)$/.test(mode) ? 'hd' : 'dvi'];
const S = JSON.parse(fs.readFileSync('/tmp/cln/p2c/seed.json'));
const OUT = `/tmp/cln/p2c/ev/${mode}`; fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await boot2('admin', { workplaceId: WP, timezone: TZ, contextOptions: { viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2, timezoneId: TZ } });
await page.evaluate(w => localStorage.setItem('location', JSON.stringify(w)), WP);
const meta = { mode, location: LNAME, location_tz: TZ, process_TZ: process.env.TZ || null, process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, observed_at_utc: new Date().toISOString(), shots: {} };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
meta.browser_now = await page.evaluate(() => new Date().toString());
const box = async loc => { const b = await loc.first().boundingBox().catch(() => null); return b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) }; };
const txt = async loc => (await loc.first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
const save = () => fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
const shot = async (name, extra = {}) => { await page.screenshot({ path: `${OUT}/${name}.png` }); meta.shots[name] = { at_utc: new Date().toISOString(), ...extra }; save(); };
const go = async (path, wait = 9000) => { await page.goto(APP + path, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(wait);
  meta.appVersion = meta.appVersion || await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null); };
const posts = []; page.on('response', async r => { if (r.request().method() !== 'GET' && r.url().includes('/api/')) posts.push(`${r.status()} ${r.request().method()} ${r.url().replace(/^.*\/api/, '')}`); });
const cells = async row => { const c = row.locator('td'); const out = []; for (let i = 0; i < await c.count(); i++) out.push({ t: (await c.nth(i).innerText()).replace(/\s+/g, ' ').trim().slice(0, 50), box: await box(c.nth(i)) }); return out; };
const taxRange = async (preset, custom) => {
  await page.locator('[data-test-id="filter_chip_range"]').click(); await page.waitForTimeout(1500);
  await page.locator(`[data-test-id="filter_preset_range_${preset}"]`).click(); await page.waitForTimeout(1200);
  if (custom) { meta.custom_menu = (await page.locator('.q-menu').last().innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 500);
    meta.custom_ids = await page.locator('.q-menu [data-test-id]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id'))); await custom(); }
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(8000); };

if (mode === 'dep') {          // C4/C5: deposit dated 26 Oct through the screen, then invoice through the screen (28 Oct)
  const W = S.DEP.wo; await go(`/workorders/${W}/finance`, 10000);
  await page.locator('button').filter({ hasText: 'Add Deposit' }).first().click(); await page.waitForTimeout(3000);
  const dlg = page.locator('.q-dialog').last();
  const d = dlg.locator('[data-test-id="date_input_create_deposit_date"]'); meta.date_default = await d.inputValue();
  await d.click({ clickCount: 3 }); await d.fill('10/26/2026'); await page.keyboard.press('Tab'); await page.waitForTimeout(800);
  await dlg.locator('[data-test-id="select_create_deposit_payment_method"]').click(); await page.waitForTimeout(1000);
  meta.pm_options = await page.locator('.q-menu .q-item, [role="option"]').allInnerTexts();
  await page.locator('.q-menu .q-item, [role="option"]').filter({ hasText: /cash/i }).first().click({ timeout: 8000 }); await page.waitForTimeout(800);
  const a = dlg.locator('[data-test-id="input_create_deposit_amount"]'); await a.click(); await a.fill('30.00'); await page.keyboard.press('Tab'); await page.waitForTimeout(1000);
  meta.date_set = await d.inputValue();
  await shot('1-deposit-dialog', { dialog: await box(dlg), date: await box(d), amount: await box(a), text: (await dlg.innerText()).replace(/\n+/g, ' / ') });
  await dlg.locator('[data-test-id="button_confirm_dialog"]').click(); await page.waitForTimeout(7000);
  meta.after_deposit_dialogs = (await page.locator('.q-dialog').allInnerTexts()).join(' || ').replace(/\n+/g, ' / ').slice(0, 400);
}
if (mode === 'invoice') {      // Create Invoice through the screen on the work order named in argv[3] (DEP | ZERO)
  const W = S[process.argv[3]].wo; await go(`/workorders/${W}/finance`, 10000);
  await page.locator('[data-test-id="button_create_invoice"]').click(); await page.waitForTimeout(6000);
  meta.dialogs = (await page.locator('.q-dialog').allInnerTexts()).join(' || ').replace(/\n+/g, ' / ').slice(0, 500);
  await go(`/workorders/${W}/finance`, 10000);
  const main = page.locator('main');
  const marks = {}; for (const t of ['Invoice Date:', 'Payments', 'Balance', '(Deposit)', 'Total']) marks[t] = await box(main.getByText(t, { exact: false }));
  await shot('1-finance-after-invoice', { marks, text: (await txt(main)).slice(0, 1800) });
}
if (mode === 'tax') {          // Sales Tax Collected, Today: rows of S1-38218 ($0) and S1-38219 (deposit)
  await go('/reports/sales-tax/invoices', 9000); await taxRange('today');
  meta.heads = await page.locator('thead th').allInnerTexts(); meta.chip = await txt(page.locator('[data-test-id="filter_chip_range"]'));
  for (const n of [S.ZERO.display, S.DEP.display]) { const row = page.locator('tr').filter({ hasText: n }).first(); meta['row_' + n] = { box: await box(row), text: await txt(row), cells: await cells(row) }; }
  meta.footer = await txt(page.locator('tfoot, .q-table__bottom').first());
  await shot('1-tax-today', { chip: await box(page.locator('[data-test-id="filter_chip_range"]')) });
  await page.locator('[data-test-id="filter_chip_statuses"]').click(); await page.waitForTimeout(1200);
  meta.status_options = (await page.locator('.q-menu').last().innerText().catch(() => '')).replace(/\n+/g, ' | ');
  await page.locator('.q-menu').last().getByText('Partially Paid', { exact: true }).click(); await page.waitForTimeout(800); await page.keyboard.press('Escape'); await page.waitForTimeout(7000);
  meta.partially = (await txt(page.locator('main'))).slice(0, 900);
  await shot('2-tax-partially-paid', { statuses: await box(page.locator('[data-test-id="filter_chip_statuses"]')), main: await box(page.locator('main table, main .q-table__container').first()) });
}
const sbr = async name => {
  await go('/reports/sales-by-representative', 9000);
  meta.chip = await txt(page.locator('[data-test-id="filter_chip_dateRange"]'));
  const btn = page.locator(`[data-test-id="button_sbr_expand_rep_${S.REP.rep}"]`); await btn.click(); await page.waitForTimeout(7000);
  const row = page.locator('tr').filter({ hasText: S.REP.display }).first(); await row.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(800);
  await shot(name, { heads: await page.locator('thead th').allInnerTexts(), rep: { box: await box(btn.locator('xpath=ancestor::tr[1]')), text: await txt(btn.locator('xpath=ancestor::tr[1]')) }, row: { box: await box(row), text: await txt(row), cells: await cells(row) } });
};
if (mode === 'sbr-before') await sbr('1-sbr-before');
if (mode === 'sbr-after') await sbr('4-sbr-after');
if (mode === 'edit') {          // C1: Reports > Timesheet Activities > Edit timesheet on S1-38217's clock: Start 30 min earlier
  await go('/reports/punch-clock-activities', 10000);
  const row = page.locator('tr').filter({ hasText: S.REP.display }).first(); await row.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(800); await row.hover().catch(() => {});
  meta.row_before = await txt(row);
  await row.locator('[data-test-id*="edit_timesheet"]').first().click(); await page.waitForTimeout(4000);
  const dlg = page.locator('.q-dialog').last();
  const start = dlg.locator('[data-test-id*="input_timesheet_start_date"] input, input[data-test-id*="input_timesheet_start_date"]').first();
  meta.start_before = await start.inputValue().catch(() => null);
  const m = (meta.start_before || '').match(/(\d{1,2}):(\d{2}) (AM|PM)/);
  let h = +m[1] % 12 + (m[3] === 'PM' ? 12 : 0), mi = +m[2] - 30; if (mi < 0) { mi += 60; h -= 1; }
  const hh = ((h + 11) % 12) + 1, ap = h >= 12 ? 'PM' : 'AM'; const want = meta.start_before.replace(m[0], `${String(hh).padStart(2, '0')}:${String(mi).padStart(2, '0')} ${ap}`);
  await start.click(); await start.fill(''); await start.type(want, { delay: 40 }); await page.keyboard.press('Tab'); await page.waitForTimeout(1200);
  meta.start_after = await start.inputValue().catch(() => null);
  await shot('2-edit-timesheet', { dialog: await box(dlg), startBox: await box(start), text: (await dlg.innerText()).replace(/\n+/g, ' | ').slice(0, 600) });
  await dlg.locator('[data-test-id="button_save_timesheet"]').click(); await page.waitForTimeout(6000);
  meta.after_save_dialog = (await page.locator('.q-dialog').allInnerTexts()).join(' || ').replace(/\n+/g, ' / ').slice(0, 300);
  const row2 = page.locator('tr').filter({ hasText: S.REP.display }).first(); meta.row_after = await txt(row2);
}
if (mode === 'stats') {
  await go(`/workorders/${S.REP.wo}/lines`, 9000); await page.getByText('Stats', { exact: true }).first().click(); await page.waitForTimeout(7000);
  const main = page.locator('main'); const marks = {}; for (const t of ['Tech hours', 'Clocked hours', 'Tech Hours', 'Clocked Hours']) marks[t] = await box(main.getByText(t, { exact: false }));
  await shot('3-stats-after', { marks, text: (await txt(main)).slice(0, 1500) });
}
if (mode === 'sbr-order') {    // C6: Unassigned expanded, This month
  await go('/reports/sales-by-representative', 9000);
  meta.chip = await txt(page.locator('[data-test-id="filter_chip_dateRange"]'));
  await page.locator('[data-test-id="filter_chip_showUnassigned"]').click(); await page.waitForTimeout(5000);
  const ub = page.locator('[data-test-id="button_sbr_expand_rep_00000000-0000-0000-0000-000000000000"]'); await ub.click(); await page.waitForTimeout(7000);
  const rows = page.locator('[data-test-id^="text_sbr_invoice_"], [data-test-id^="link_sbr_invoice_"]');
  meta.invoice_rows = await rows.evaluateAll(es => es.map(e => { const tr = e.closest('tr'); return tr.innerText.replace(/\s+/g, ' ').slice(0, 60); }));
  await ub.locator('xpath=ancestor::tr[1]').scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
  const first = page.locator('tr').filter({ hasText: 'Oct 28 2026' });
  const rb = []; for (let i = 0; i < Math.min(await first.count(), 25); i++) rb.push({ text: (await first.nth(i).innerText()).replace(/\s+/g, ' ').slice(0, 50), box: await box(first.nth(i)) });
  await shot('1-sbr-unassigned', { unassigned: await box(ub.locator('xpath=ancestor::tr[1]')), rows: rb, chipBox: await box(page.locator('[data-test-id="filter_chip_dateRange"]')) });
}
if (mode === 'tax-cm') {       // C2: Heavy Duty, Sales Tax Collected, custom 20 Oct 2026 (CM2-4520 day) + Sales report the same day
  await go('/reports/sales-tax/invoices', 9000);
  await taxRange('custom', async () => {
    const ins = page.locator('.q-menu input'); meta.custom_inputs = await ins.evaluateAll(es => es.map(e => (e.getAttribute('data-test-id') || '') + '=' + e.value));
    if (await ins.count() >= 2) { for (const [i, v] of [[0, '10/20/2026'], [1, '10/20/2026']]) { const f = ins.nth(i); await f.click({ clickCount: 3 }); await f.fill(v); await page.keyboard.press('Tab'); await page.waitForTimeout(600); } }
    const ap = page.locator('.q-menu button').filter({ hasText: /Apply/i }); if (await ap.count()) await ap.first().click();
  });
  meta.chip = await txt(page.locator('[data-test-id="filter_chip_range"]'));
  meta.rows = await page.locator('tbody tr').evaluateAll(trs => trs.map(t => t.innerText.replace(/\s+/g, ' ').trim()));
  meta.footer = await page.locator('tfoot tr, .q-table__bottom').evaluateAll(es => es.map(e => e.innerText.replace(/\s+/g, ' ')));
  const tbl = page.locator('main table').first();
  await shot('1-tax-oct20', { chip: await box(page.locator('[data-test-id="filter_chip_range"]')), table: await box(tbl), foot: await box(page.locator('tfoot').first()),
    taxcol: await box(page.locator('thead th').filter({ hasText: 'Taxes' })), rowboxes: await page.locator('tbody tr').evaluateAll(trs => trs.map(t => { const b = t.getBoundingClientRect(); return [Math.round(b.x * 2), Math.round(b.y * 2), Math.round(b.width * 2), Math.round(b.height * 2)]; })) });
  await go('/reports/sales', 9000);
  meta.sales_chips = await page.locator('[data-test-id^="filter_chip_"]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id') + '=' + e.innerText.replace(/\s+/g, ' ')));
  save();
}
if (mode === 'cm-customer') {  // C2: the credit memo as the customer's account shows it (Heavy Duty, Testing Company Milos)
  await go('/customers', 8000);
  meta.cust_ids = await page.locator('[data-test-id]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id')).filter(x => /search/i.test(x)).slice(0, 10));
  save();
}
meta.posts = posts; save();
console.log(JSON.stringify({ mode, v: meta.appVersion, browser_zone: meta.browser_zone, process_zone: meta.process_zone, location_tz: meta.location_tz, shots: Object.keys(meta.shots) }));
console.log(JSON.stringify(Object.fromEntries(Object.entries(meta).filter(([k]) => !['shots', 'posts'].includes(k)))).slice(0, 3000));
console.log('SHOTS', JSON.stringify(meta.shots).slice(0, 3500)); console.log('POSTS', JSON.stringify(posts).slice(0, 600));
await browser.close();
