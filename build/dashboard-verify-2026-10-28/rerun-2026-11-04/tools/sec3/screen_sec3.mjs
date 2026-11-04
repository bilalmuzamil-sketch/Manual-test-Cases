// Section-3 screen re-check (4 Nov 2026). One mode per run, one location per run, all in that location's zone (Rule 99, via f3boot:
// session change-location, browser timezoneId, app localStorage 'timezone' + 'location'; process TZ asserted). Header checked at start
// and end. Pictures at deviceScaleFactor 2 into phase2/pictures. SECRET-FREE.
// Usage: TZ=<zone> node screen_sec3.mjs d7|payDVI|payHD|pv
import fs from 'fs';
import { assertLoc } from '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/tools/f3/f3boot.mjs';
const mode = process.argv[2]; const where = { d7: 'dvi', payDVI: 'dvi', payHD: 'hd', pv: 'hd', taDVI: 'dvi', taHD: 'hd' }[mode];
const APP = 'https://app.staging.shopview.com';
const PIC = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/phase2/pictures';
const OUT = `/tmp/cln/s3/screen-${mode}`; fs.mkdirSync(OUT, { recursive: true });
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
import { LOC } from '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/tools/f3/f3boot.mjs';
const [WP, TZ, LNAME] = LOC[where];
if (process.env.TZ !== TZ) { console.error('run with TZ=' + TZ); process.exit(2); }
// same as f3boot, plus acceptDownloads
const { browser, page: p } = await boot2('admin', { workplaceId: WP, timezone: TZ, contextOptions: { viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2, timezoneId: TZ, acceptDownloads: true } });
await p.evaluate(([w, z]) => { localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(z)); }, [WP, TZ]);
const meta = { mode, started_utc: new Date().toISOString(), shots: {}, notes: {} };
meta.rule99 = { location: LNAME, workplace_id: WP, location_tz: TZ, zone_source: 'f3boot LOC (matches GET /api/staff/my-workplaces read live 4 Nov)', process_TZ: process.env.TZ,
  browser_zone: await p.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone), app_timezone_key: await p.evaluate(() => localStorage.getItem('timezone')), app_location_key: await p.evaluate(() => localStorage.getItem('location')), session_change_location: { workplace_id: WP, workplace_timezone: TZ } };
const go = async (path, wait = 12000) => { await p.goto(APP + path, { waitUntil: 'domcontentloaded', timeout: 90000 }); await p.waitForTimeout(wait);
  meta.appVersion = meta.appVersion || await p.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
  if (!meta.loc_start) meta.loc_start = await assertLoc(p, LNAME, WP); };
const B = b => b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
const box = async l => B(await l.first().boundingBox({ timeout: 4000 }).catch(() => null));
const txt = async l => (await l.first().innerText({ timeout: 4000 }).catch(() => '')).replace(/\s+/g, ' ').trim();
const shot = async (name, extra = {}) => { const f = `${PIC}/${name}.png`; await p.screenshot({ path: f }); meta.shots[name] = { at_utc: new Date().toISOString(), ...extra }; console.log('shot', name); };
const parse = l => { const o = []; let cur = '', q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { o.push(cur); cur = ''; } else cur += ch; } o.push(cur); return o; };
async function renderCsv(file, { title, keep, mark, name }) {
  const lines = fs.readFileSync(file, 'utf8').replace(/\r/g, '').trim().split('\n'); const rows = lines.map(parse); const head = rows[0]; let body = rows.slice(1);
  if (keep) body = body.filter(keep);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  meta.notes.header_before_render = (await txt(p.locator('header'))).slice(-80);
  await p.setContent(`<html><body style="font-family:Calibri,Arial,sans-serif;margin:24px;background:#fff"><div style="font-size:18px;margin-bottom:10px">${esc(title)}</div><table style="border-collapse:collapse;font-size:16px"><tr>${head.map(h => `<th style="border:1px solid #bbb;background:#e8eef7;padding:6px 12px;text-align:left">${esc(h)}</th>`).join('')}</tr>${body.map(r => `<tr style="${mark && mark(r) ? 'background:#fff3b0;font-weight:bold' : ''}">${r.map(x => `<td style="border:1px solid #ccc;padding:6px 12px">${esc(x)}</td>`).join('')}</tr>`).join('')}</table></body></html>`);
  await p.setViewportSize({ width: 1600, height: Math.min(1000, 120 + 36 * (body.length + 1)) }); await p.waitForTimeout(500);
  await shot(name, { file: file.split('/').pop(), rows: body.map(r => r.join(' | ')).slice(0, 40) }); await p.setViewportSize({ width: 1600, height: 1000 });
}
async function exportDialog(report, range, from, to) {
  await p.getByText('Export Reports', { exact: true }).first().click(); await p.waitForTimeout(3000);
  const dlg = p.locator('.q-dialog').last();
  const pick = async (tid, label) => { await dlg.locator(`[data-test-id="${tid}"]`).first().click(); await p.waitForTimeout(1200); await p.locator('.q-menu .q-item').filter({ hasText: new RegExp('^\\s*(check\\s*)?' + label + '\\s*$') }).first().click(); await p.waitForTimeout(1200); };
  await pick('select_report_name', report); await pick('select_date_range', range);
  if (range === 'Custom') for (const [n, v] of [['export_startDate', from], ['export_endDate', to]]) { const i = dlg.locator(`input[name="${n}"]`).first(); await i.click(); await i.fill(v); await p.keyboard.press('Tab'); await p.waitForTimeout(800); }
  await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(300);
  const d2 = p.locator('.q-dialog').last(); meta.notes['dialog_' + report] = (await d2.innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 400);
  const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 150000 }), d2.locator('button').filter({ hasText: /^\s*Export\s*$/ }).first().click()]);
  const f = `${OUT}/${dl.suggestedFilename()}`; await dl.saveAs(f); meta.notes['download_' + report] = dl.suggestedFilename(); await p.waitForTimeout(1500); return f;
}
const mdY = d => d.toLocaleDateString('en-US', { timeZone: TZ, month: '2-digit', day: '2-digit', year: 'numeric' });
try {
  if (mode === 'd7') {
    await go('/workorders/37fa09a3-7317-4097-bef4-7ab894c40156/lines', 12000);
    await p.getByText('Finance', { exact: true }).first().click(); await p.waitForTimeout(9000);
    const terms = p.getByText(/Terms/).first(); meta.notes.finance = (await txt(p.locator('main'))).slice(0, 1200);
    await shot('P2-D7-1-v3-invoice-s1-38216-terms-cod-2026-11-04', { terms: await box(terms) });
    await go('/reports/sales', 12000);
    const f = await exportDialog('Customer Invoice', 'Last Month');
    await renderCsv(f, { title: `Customer Invoice export (DVI Test, Date Range: Last Month) - downloaded ${new Date().toISOString().slice(0, 16)} UTC`, keep: r => /^S1-382(1[0-9]|2[0-9])$/.test(r[0]) || r[0] === 'S1-38216', mark: r => r[0] === 'S1-38216', name: 'P2-D7-2-v3-customer-invoice-export-last-month-terms-net-30-2026-11-04' });
  }
  if (mode === 'payDVI' || mode === 'payHD') {
    const today = mdY(new Date()); const yr = today.slice(-4);
    if (mode === 'payDVI') {
      await go('/reports/punch-clock-activities?range=custom&startDate=2026-10-29&endDate=2026-10-29', 12000);
      meta.notes.ta_chip = await txt(p.locator('[data-test-id="filter_chip_range"], [data-test-id="filter_chip_dateRange"]'));
      const rows = p.locator('tbody tr').filter({ hasText: 'S1-38220' }); meta.notes.ta_rows = await rows.evaluateAll(t => t.map(r => r.innerText.replace(/\s+/g, ' ')));
      await shot('P2-A5-1-v2-timesheet-two-overlapping-fiji-2026-11-04', { rows: await box(rows) });
    } else {
      await go('/reports/punch-clock-activities?range=custom&startDate=2026-09-18&endDate=2026-09-19&technicianId=7f85bc58-9ff5-4b50-b3f3-d85821069066', 12000);
      meta.notes.ta_chip = await txt(p.locator('[data-test-id="filter_chip_range"], [data-test-id="filter_chip_dateRange"]'));
      meta.notes.ta_rows = await p.locator('tbody tr').evaluateAll(t => t.map(r => r.innerText.replace(/\s+/g, ' ')).slice(0, 30));
      await shot('P2-A6-1-timesheet-activities-18-19-sep-2026-11-04', { s2_15119: await box(p.locator('tbody tr').filter({ hasText: 'S2-15119' })) });
    }
    await go('/reports/sales', 10000);
    const f = await exportDialog('Payroll Timesheet', 'Custom', `01/01/${yr}`, today); meta.notes.export_window = [`01/01/${yr}`, today];
    const lines = fs.readFileSync(f, 'utf8').replace(/\r/g, '').trim().split('\n').map(parse); const head = lines[0]; let cur = null; const tagged = lines.slice(1).map(r => { if (r[head.indexOf('Employee Name')] && !/^Total for/.test(r[head.indexOf('Employee Name')])) cur = r[head.indexOf('Employee Name')]; return [cur, r]; });
    const di = head.indexOf('Date');
    const want = mode === 'payDVI' ? [['Admin Shopview', ['2026-10-29']]] : [['Haley Brown', ['2026-09-06']], ['Admin Shopview', ['2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20']]];
    meta.notes.export_rows = {};
    for (const [who, days] of want) meta.notes.export_rows[who] = tagged.filter(([c, r]) => c === who && days.includes(r[di])).map(([, r]) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
    // a small file holding only the person's rows, for the picture
    const small = `${OUT}/rows-${mode}.csv`; fs.writeFileSync(small, ['Employee,' + head.join(','), ...want.flatMap(([who, days]) => tagged.filter(([c, r]) => c === who && days.includes(r[di])).map(([, r]) => [who, ...r].map(x => /,/.test(x) ? `"${x}"` : x).join(',')))].join('\n'));
    if (mode === 'payDVI') await renderCsv(small, { title: `payroll_timesheet.csv (DVI Test, Custom 01/01/${yr} to ${today}) - Admin Shopview, 29 Oct 2026`, mark: () => true, name: 'P2-A5-2-v2-payroll-export-29-oct-1-53-2026-11-04' });
    else {
      await renderCsv(small, { title: `payroll_timesheet.csv (Staging Heavy Duty - 9919, Custom 01/01/${yr} to ${today}) - Haley Brown 6 Sep; Admin Shopview 16-20 Sep`, mark: r => r[0] === 'Haley Brown', name: 'P2-A5-3-v2-payroll-export-haley-brown-28-50-2026-11-04' });
      await renderCsv(small, { title: `payroll_timesheet.csv (Staging Heavy Duty - 9919, Custom 01/01/${yr} to ${today}) - Admin Shopview 16-20 Sep 2026`, keep: r => r[0] === 'Admin Shopview', mark: r => ['2026-09-18', '2026-09-19'].includes(r[1 + di]), name: 'P2-A6-2-payroll-export-18-sep-23-67-19-sep-24-33-2026-11-04' });
    }
  }
  if (mode === 'taDVI' || mode === 'taHD') {   // Timesheet Activities through the date chip (a URL range does not load rows on this build)
    const reqs = []; p.on('request', r => { if (/punch-clock-activities/.test(r.url())) reqs.push(decodeURIComponent(r.url()).replace(/^.*\/api/, '')); });
    await go('/reports/punch-clock-activities', 12000);
    const chip = p.locator('[data-test-id="filter_chip_range"], [data-test-id="filter_chip_dateRange"]').first(); const chipId = await chip.getAttribute('data-test-id');
    const prefix = 'filter_preset_' + chipId.replace('filter_chip_', '') + '_';
    await chip.click(); await p.waitForTimeout(1500);
    meta.notes.presets = await p.locator(`[data-test-id^="${prefix}"]`).evaluateAll((es, x) => es.map(e => e.getAttribute('data-test-id').replace(x, '') + '=' + e.innerText.trim()), prefix);
    const want = mode === 'taDVI' ? /^last_month/ : /^custom/; const id = meta.notes.presets.map(x => x.split('=')[0]).find(x => want.test(x));
    await p.locator(`[data-test-id="${prefix}${id}"]`).first().click(); await p.waitForTimeout(1000);
    if (mode === 'taHD') { const m = p.locator('.q-menu').last(); meta.notes.custom_menu = (await m.innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 400);
      meta.notes.custom_inputs = await m.locator('input').evaluateAll(es => es.map(e => ({ n: e.name, ph: e.placeholder, v: e.value, tid: e.closest('[data-test-id]')?.getAttribute('data-test-id') })));
      for (const [n, v] of [['start_date', '09/18/2026'], ['end_date', '09/19/2026']]) { const i = m.locator(`input[name="${n}"]`).first(); await i.click(); await i.fill(v); await p.keyboard.press('Tab'); await p.waitForTimeout(700); } }
    const ap = p.locator('.q-menu button').filter({ hasText: /^\s*Apply\s*$/ }); if (await ap.count()) await ap.first().click().catch(() => {});
    await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(10000);
    meta.notes.chip = await txt(chip);
    const key = mode === 'taDVI' ? 'S1-38220' : 'S2-15119';
    const rows = p.locator('tbody tr').filter({ hasText: key }); await rows.first().scrollIntoViewIfNeeded().catch(() => {}); await p.mouse.wheel(0, -250); await p.waitForTimeout(1500);
    meta.notes.rows = await rows.evaluateAll(t => t.map(r => r.innerText.replace(/\s+/g, ' ')));
    meta.notes.requests = [...new Set(reqs)].slice(0, 6);
    if (mode === 'taDVI') await shot('P2-A5-1-v2-timesheet-two-overlapping-fiji-2026-11-04', { rows: await box(rows) });
    else await shot('P2-A6-1-timesheet-activities-18-19-sep-2026-11-04', { rows: await box(rows) });
  }
  if (mode === 'pv') {
    const S = JSON.parse(fs.readFileSync('/tmp/cln/s3/seed.json'));
    await go('/reports/parts-velocity', 14000);
    await p.evaluate(() => { for (const k of Object.keys(localStorage)) if (/parts-velocity/.test(k)) localStorage.removeItem(k); });
    await go('/reports/parts-velocity', 14000);
    // Date: Last 12 months
    await p.locator('.pv-filter-band button, button').filter({ hasText: /^\s*(event\s*)?Date/ }).first().click(); await p.waitForTimeout(1500);
    await p.locator('.q-menu').last().getByText('Last 12 months', { exact: true }).first().click(); await p.waitForTimeout(1000);
    const ap = p.locator('.q-menu button').filter({ hasText: /^\s*Apply\s*$/ }); if (await ap.count()) await ap.first().click().catch(() => {});
    await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(6000);
    // Location: Select all
    await p.locator('button').filter({ hasText: /^\s*(\S+\s*)?Location/ }).first().click(); await p.waitForTimeout(1500);
    const sa = p.locator('.q-menu').last().getByText(/Select all/i).first(); if (await sa.count()) await sa.click(); await p.waitForTimeout(800);
    await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(6000);
    await p.locator('[data-test-id="input_report_search"]').fill(S.cat.pn); await p.waitForTimeout(8000);
    meta.notes.filters = (await txt(p.locator('.pv-filter-band'))).slice(0, 300) || (await txt(p.locator('main'))).slice(0, 300);
    const row = p.locator('tbody tr').filter({ hasText: S.cat.pn }); meta.notes.pv_row = await txt(row);
    meta.notes.heads = await p.locator('thead th').evaluateAll(t => t.map(x => x.innerText.replace(/\s+/g, ' ').replace(/arrow_\w+|info_outline/g, '').trim()).filter(Boolean));
    meta.notes.local_time_on_screen = new Date().toLocaleString('en-US', { timeZone: TZ });
    await shot('P2-B8-1-parts-velocity-last-sale-0-days-2026-11-05', { row: await box(row), lastSaleHead: await box(p.locator('thead th').filter({ hasText: 'Last Sale' })) });
    await go(`/workorders/${S.wo}/lines`, 12000);
    await p.getByText('Finance', { exact: true }).first().click(); await p.waitForTimeout(9000);
    meta.notes.finance = (await txt(p.locator('main'))).slice(0, 1200);
    await shot('P2-B8-2-invoice-s2-38354-4-nov-2026-11-05', { part: await box(p.getByText(S.cat.pn)) });
  }
  await p.goto(APP + '/reports', { waitUntil: 'domcontentloaded', timeout: 90000 }); await p.waitForTimeout(8000);
  meta.loc_end = await assertLoc(p, LNAME, WP).catch(e => String(e));
} catch (e) { meta.error = String(e).slice(0, 600); await p.screenshot({ path: `${OUT}/error.png` }).catch(() => {}); }
meta.finished_utc = new Date().toISOString();
fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1)); fs.writeFileSync(`/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/rerun-2026-11-04/results/sec3/screen-${mode}.json`, JSON.stringify(meta, null, 1));
console.log(JSON.stringify(meta, null, 1).slice(0, 4500));
await browser.close().catch(() => {});
