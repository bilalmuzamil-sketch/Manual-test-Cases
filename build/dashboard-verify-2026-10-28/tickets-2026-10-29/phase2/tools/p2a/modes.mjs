// p2a screen modes, driven by ev_p2a.mjs (which handles Rule 99 zones and meta.json). SECRET-FREE.
export async function run(c) {
  if (/^A5/.test(c.mode) && c.mode !== 'A5HD') return runA5(c);
  if (/^A4/.test(c.mode)) return runDvi(c);
  const { mode, page, meta, shot, go, box, txt, rowsOf, heads, search, preset } = c;
  const custFilter = async name => { await page.getByText('Customer: All customers').first().click(); await page.waitForTimeout(2500);
    const menu = page.locator('.q-menu').last(); const inp = menu.locator('input').first(); if (await inp.count()) { await inp.fill(name); await page.waitForTimeout(4000); }
    await menu.getByText(name, { exact: true }).first().click(); await page.waitForTimeout(1500); await page.keyboard.press('Escape'); await page.waitForTimeout(8000); };
  if (mode === 'A1') {   // Work In Progress, Heavy Duty: Days Open wording
    await go('/reports/work-in-progress', 15000);
    meta.tabs = await page.locator('[data-test-id="page_work_in_progress_report"] .q-tab').allInnerTexts().catch(() => []);
    const tbl = page.locator('[data-test-id="table_work_in_progress_report"]');
    await page.getByText('Customer: All customers').first().click(); await page.waitForTimeout(2500);
    const menu = page.locator('.q-menu').last(); meta.custMenu = (await menu.innerText().catch(() => '')).slice(0, 400);
    const inp = menu.locator('input').first(); if (await inp.count()) { await inp.fill('4 Star Truck'); await page.waitForTimeout(4000); }
    meta.custMenu2 = (await menu.innerText().catch(() => '')).slice(0, 400);
    await menu.getByText('4 Star Truck Repair', { exact: true }).first().click().catch(e => meta.custErr = String(e).slice(0, 200)); await page.waitForTimeout(1500);
    await page.keyboard.press('Escape'); await page.waitForTimeout(8000);
    meta.heads = await heads();
    const dh = tbl.locator('thead th').filter({ hasText: 'Days Open' }).first();
    const col = meta.heads.findIndex(h => /Days Open/.test(h));
    let rows = await rowsOf('[data-test-id="table_work_in_progress_report"] tbody tr', 60);
    meta.days_values = [...new Set(rows.map(r => r[col]))].slice(0, 20);
    if (!rows.some(r => r[col] === '1 days')) { await dh.click(); await page.waitForTimeout(5000); rows = await rowsOf('[data-test-id="table_work_in_progress_report"] tbody tr', 60); meta.days_values_sorted = [...new Set(rows.map(r => r[col]))].slice(0, 20); }
    const hit = rows.find(r => r[col] === '1 days');
    meta.hit = hit;
    if (hit) { const wo = hit.find(x => /^S\d-\d+/.test(x)) || hit[0]; meta.hit_wo = wo;
      const row = tbl.locator('tbody tr').filter({ hasText: wo }).first(); await row.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(800);
      const cell = row.locator('td').nth(col);
      await shot('1-wip-days-open', { row: await box(row), cell: await box(cell), cellText: await txt(cell), head: await box(dh), rowText: await txt(row) }); }
    else await shot('1-wip-days-open-nohit', { rows: rows.slice(0, 10) });
  }
  if (mode === 'A2') {   // Work In Progress, Heavy Duty, Approved - not started: S2-33740, then its parts on the work order
    await go('/reports/work-in-progress', 15000);
    const tabs = page.locator('[data-test-id="page_work_in_progress_report"] .q-tab');
    meta.tabs = await tabs.allInnerTexts().catch(() => []);
    await custFilter('4 Star Truck Repair');
    const colBtn = page.locator('[data-test-id*="column"]').filter({ has: page.locator('i, svg') }).first();
    meta.colBtns = await page.locator('[data-test-id*="column"]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id'))).catch(() => []);
    await colBtn.click().catch(e => meta.colErr = String(e).slice(0, 150)); await page.waitForTimeout(2000);
    const cm = page.locator('.q-menu').last(); meta.colMenu = (await cm.innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 600);
    meta.toggles = await cm.locator('[data-test-id^="toggle_column_"]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id') + '=' + e.getAttribute('aria-checked')));
    for (const k of ['parts_earned', 'parts_remaining']) { const t = cm.locator(`[data-test-id="toggle_column_${k}"]`); if (await t.count() && (await t.getAttribute('aria-checked')) !== 'true') { await t.click(); await page.waitForTimeout(1200); } }
    for (const k of ['asset', 'advisor']) { const t = cm.locator(`[data-test-id="toggle_column_${k}"]`); if (await t.count() && (await t.getAttribute('aria-checked')) === 'true') { await t.click(); await page.waitForTimeout(1200); } }
    meta.colMenu2 = (await cm.innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 600);
    await page.keyboard.press('Escape'); await page.waitForTimeout(3000);
    await tabs.filter({ hasText: /not started/i }).first().click(); await page.waitForTimeout(8000);
    meta.heads = await heads();
    let found = await page.locator('[data-test-id="table_work_in_progress_report"] tbody tr').filter({ hasText: 'S2-33740' }).count();
    for (let p = 0; p < 40 && !found; p++) { const nx = page.locator('[data-test-id*="pagination"] button, .q-table__bottom button').filter({ hasText: /chevron_right|navigate_next/ }).first();
      if (!(await nx.count()) || await nx.isDisabled()) break; await nx.click(); await page.waitForTimeout(3500);
      found = await page.locator('[data-test-id="table_work_in_progress_report"] tbody tr').filter({ hasText: 'S2-33740' }).count(); meta.pagesWalked = p + 1; }
    const tbl = page.locator('[data-test-id="table_work_in_progress_report"]');
    const row = tbl.locator('tbody tr').filter({ hasText: 'S2-33740' }).first();
    await row.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(1500);
    meta.heads = await heads();
    const cells = []; for (let i = 0; i < await row.locator('td').count(); i++) cells.push({ t: (await row.locator('td').nth(i).innerText()).trim(), box: await box(row.locator('td').nth(i)) });
    await shot('1-wip-row', { row: await box(row), cells, heads: meta.heads, tab: await txt(tabs.filter({ hasText: /not started/i })) });
    await go('/workorders/5be91ec3-06a2-4cf3-bd45-34c83f18823c/lines', 12000);
    const main = page.locator('main');
    const rl = main.getByText('Receive Later', { exact: false });
    meta.rl_count = await rl.count();
    await rl.first().scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(1000);
    const boxes = []; for (let i = 0; i < meta.rl_count; i++) boxes.push(await box(rl.nth(i)));
    await shot('2-work-order-parts', { rl: boxes, text: (await txt(main)).slice(0, 2500) });
  }
  if (mode === 'A3') {   // Timesheet Activities, Heavy Duty, This year: Monique Turner 13 May 2026 (deleted work order)
    await go('/reports/punch-clock-activities', 12000);
    await preset('this_year');
    await page.getByText('Filter by Staff').first().click(); await page.waitForTimeout(2500);
    const menu = page.locator('.q-menu').last(); meta.staffMenu = (await menu.innerText().catch(() => '')).slice(0, 300);
    const inp = menu.locator('input').first(); if (await inp.count()) { await inp.fill('Monique'); await page.waitForTimeout(3000); }
    await menu.getByText('Monique Turner', { exact: true }).first().click(); await page.waitForTimeout(1500); await page.keyboard.press('Escape'); await page.waitForTimeout(9000);
    meta.bottom = (await page.locator('.q-table__bottom').first().innerText().catch(() => '')).replace(/\n+/g, ' | ');
    const woh = page.locator('thead th').filter({ hasText: 'Work Order' }).first();
    for (let k = 0; k < 2 && !(await page.locator('tbody tr').filter({ hasText: 'May 13' }).count()); k++) { await woh.click(); await page.waitForTimeout(6000); meta.woSortClicks = k + 1; }
    for (let p = 0; p < 30; p++) { if (await page.locator('tbody tr').filter({ hasText: 'May 13' }).count()) break;
      const nx = page.locator('.q-table__bottom button, [data-test-id*="pagination"] button').filter({ hasText: /chevron_right|navigate_next/ }).first();
      if (!(await nx.count()) || await nx.isDisabled()) break; await nx.click(); await page.waitForTimeout(4000); meta.pagesWalked = p + 1; }
    meta.heads = await heads();
    const rows = await rowsOf('tbody tr', 80); meta.rows = rows.filter(r => r.join(' ').includes('May 13'));
    const row = page.locator('tbody tr').filter({ hasText: 'May 13' }).filter({ hasText: '09:52 PM' }).first();
    await row.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(800);
    const cells = []; for (let i = 0; i < await row.locator('td').count(); i++) cells.push({ t: (await row.locator('td').nth(i).innerText()).trim(), box: await box(row.locator('td').nth(i)) });
    const others = page.locator('tbody tr').filter({ hasText: 'Monique Turner' }).filter({ hasText: /S2-\d+/ }).first();
    await shot('1-ta-blank-wo', { row: await box(row), cells, heads: meta.heads, other: { box: await box(others), text: await txt(others) }, chip: await txt(page.locator('[data-test-id="filter_chip_range"]')) });
  }
  if (mode === 'A5HD') {   // Export Reports -> Payroll Timesheet, Heavy Duty, Last Month (= September 2026): Haley Brown
    await go('/reports/punch-clock-activities', 10000);
    const f = await exportPayroll(c, { range: 'Last Month', shotName: '1-export' });
    let who = null; await renderCsv(c, f, { title: `${f.split('/').pop()}  (Reports > Export Reports, Staging Heavy Duty - 9919, Payroll Timesheet, Last Month = September 2026), Haley Brown's rows`,
      keep: r => { if (r[0] && !r[0].startsWith('Total for')) who = r[0]; return who === 'Haley Brown' || r[0] === 'Total for Haley Brown'; }, mark: r => r[1] === '2026-09-06' || (r[1] && parseFloat(r[2]) > 24), shotName: '2-export-file-haley' });
  }
}

// ---- DVI Test (America/Toronto) modes: timesheets made ON SCREEN on ZZAUTOTEST work order S1-38220 ----
export async function newTimesheet(c, { staff, wo, line, start, end, shotName, onOverlap = 'close' }) {
  const { page, meta, shot, box, txt } = c;
  await page.locator('[data-test-id="button_new_timesheet"]').click(); await page.waitForTimeout(3500);
  const dlg = page.locator('.q-dialog').last();
  const pick = async (tid, typed, label) => { const sel = dlg.locator(`[data-test-id="${tid}"]`).first(); await sel.click(); await page.waitForTimeout(1500);
    const inp = sel.locator('input').first(); if (typed && await inp.count() && (await inp.getAttribute('readonly')) === null) { await inp.fill(typed); await page.waitForTimeout(3500); }
    const opt = page.locator('.q-menu .q-item').filter({ hasText: label }).first(); meta[`opts_${tid}`] = (await page.locator('.q-menu').last().innerText().catch(() => '')).slice(0, 300);
    await opt.click(); await page.waitForTimeout(2000); };
  await pick('select_timesheet_staff', staff, staff);
  if (wo) { await pick('select_timesheet_work_order', wo, wo); await pick('select_timesheet_line', null, line); }
  const setDT = async (tid, v) => { const i = dlg.locator(`[data-test-id="${tid}"] input, input[data-test-id="${tid}"]`).first(); await i.click(); await i.fill(''); if (v) await i.type(v, { delay: 30 }); await page.keyboard.press('Tab'); await page.waitForTimeout(1000); return i.inputValue().catch(() => null); };
  meta.start_set = await setDT('input_timesheet_start_date', start);
  meta.end_set = await setDT('input_timesheet_end_date', end);
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(300);
  const dlg2 = page.locator('.q-dialog').last();
  if (shotName) await shot(shotName, { dlg: await box(dlg2), text: (await dlg2.innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 600) });
  const posts = []; const h = async r => { if (r.request().method() !== 'GET' && /technician-tasks|timesheet/.test(r.url())) posts.push(`${r.status()} ${r.request().method()} ${r.url().replace(/^.*\/api/, '')}`); }; page.on('response', h);
  await dlg2.locator('[data-test-id="button_save_timesheet"]').click(); await page.waitForTimeout(6000);
  const ow = page.locator('.q-dialog').filter({ hasText: 'Confirm Overwrite' });
  if (await ow.count()) { meta.overwrite_text = (await ow.last().innerText()).replace(/\n+/g, ' | ').slice(0, 800);
    await shot((shotName || 'ts') + '-overwrite', { dlg: await box(ow.last()) });
    if (onOverlap === 'cancel' || onOverlap === 'close') { const x = ow.last().locator('[data-test-id="button_cancel_overwrite_confirmation"], button').filter({ hasText: /Cancel/i }).first(); meta.closeBtn = await txt(x); await x.click().catch(() => page.keyboard.press('Escape')); await page.waitForTimeout(4000); } }
  meta.after_dialogs = (await page.locator('.q-dialog').allInnerTexts().catch(() => [])).map(x => x.replace(/\n+/g, ' | ').slice(0, 200));
  page.off('response', h); meta.posts = (meta.posts || []).concat(posts);
}
export async function runDvi(c) {
  const { mode, page, meta, shot, go, box, txt, rowsOf, heads, preset } = c;
  const fmt = d => d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/,(?= \d{2}:)/, '');
  if (mode === 'A4') {     // a running timesheet (no End), started 40 minutes ago, then Shop Efficiency + Technician Utilization, Today
    await go('/reports/punch-clock-activities', 10000);
    const st = new Date(Date.now() - 40 * 60000); st.setSeconds(0, 0); meta.start_wanted = fmt(st);
    await newTimesheet(c, { staff: 'Admin Shopview', wo: 'S1-38220', line: 'Test DVI Line', start: meta.start_wanted, end: '', shotName: '1-new-timesheet' });
    await preset('today');
    const row = page.locator('tbody tr').filter({ hasText: 'S1-38220' }).first();
    await shot('2-ta-running', { row: await box(row), text: await txt(row) });
  }
  if (mode === 'A4b') {    // read-only: Shop Efficiency and Technician Utilization, Today
    await go('/reports/shop-billing-efficiency', 12000);
    try { await preset('today'); } catch (e) { meta.se_preset_err = String(e).slice(0, 150); }
    meta.se_text = (await txt(page.locator('main'))).slice(0, 1500);
    const tc = page.getByText('Total Clocked Hours', { exact: false }).first();
    await shot('3-shop-efficiency-today', { label: await box(tc), chip: await txt(page.locator('[data-test-id="filter_chip_range"]')) });
    await go('/reports/technician-utilization', 12000);
    try { await page.locator('button, .q-btn').filter({ hasText: 'Date:' }).first().click(); await page.waitForTimeout(1500);
      const m = page.locator('.q-menu').last(); meta.tu_menu = (await m.innerText()).replace(/\n+/g, ' | ').slice(0, 300);
      await m.getByText('Today', { exact: true }).first().click(); await page.waitForTimeout(1200);
      const ap = m.getByText(/^Apply$/).first(); if (await ap.count()) await ap.click().catch(() => {});
      await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(8000); } catch (e) { meta.tu_preset_err = String(e).slice(0, 150); }
    const row = page.locator('tbody tr').filter({ hasText: 'Admin Shopview' }).first();
    await shot('4-tu-today', { row: await box(row), text: await txt(row), heads: await heads(), chip: await txt(page.locator('[data-test-id="filter_chip_range"]')), dateBtn: await txt(page.locator('button, .q-btn').filter({ hasText: 'Date' })), dateBox: await box(page.locator('button, .q-btn').filter({ hasText: 'Date' })) });
  }
}

// Export Reports -> Payroll Timesheet, downloaded through the screen. range = 'Last Month' | 'Custom' (+ MM/DD/YYYY dates)
export async function exportPayroll(c, { range, from, to, shotName }) {
  const { page, meta, shot, box, OUT } = c;
  await page.locator('a, .q-item').filter({ hasText: /^\s*Export Reports\s*$/ }).first().click(); await page.waitForTimeout(3000);
  const dlg = page.locator('.q-dialog').last();
  const pick = async (tid, label) => { await dlg.locator(`[data-test-id="${tid}"]`).first().click(); await page.waitForTimeout(1200);
    await page.locator('.q-menu .q-item').filter({ hasText: new RegExp('^\\s*' + label + '\\s*$') }).first().click(); await page.waitForTimeout(1200); };
  await pick('select_report_name', 'Payroll Timesheet');
  await pick('select_date_range', range);
  if (range === 'Custom') { for (const [n, v] of [['export_startDate', from], ['export_endDate', to]]) { const i = dlg.locator(`input[name="${n}"]`).first(); await i.click(); await i.fill(v); await page.keyboard.press('Tab'); await page.waitForTimeout(800); } }
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(300);
  const d2 = page.locator('.q-dialog').last(); meta.export_dialog = (await d2.innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 400);
  if (shotName) await shot(shotName + '-dialog', { dlg: await box(d2) });
  const btn = d2.locator('button').filter({ hasText: /^\s*Export\s*$/ }).first();
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }), btn.click()]);
  const f = `${OUT}/${dl.suggestedFilename()}`; await dl.saveAs(f); meta.download = { file: f, name: dl.suggestedFilename() };
  await page.waitForTimeout(2000); return f;
}
// render a downloaded CSV as a plain spreadsheet-like table (so the file's own rows can be pictured), highlight rows
export async function renderCsv(c, file, { title, keep, mark, shotName }) {
  const { page, shot, box, meta } = c; const fs = await import('fs');
  const lines = fs.readFileSync(file, 'utf8').trim().split('\n');
  const parse = l => { const o = []; let cur = '', q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { o.push(cur); cur = ''; } else cur += ch; } o.push(cur); return o; };
  const rows = lines.map(parse); const head = rows[0]; let body = rows.slice(1);
  if (keep) body = body.filter(keep);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const html = `<html><body style="font-family:Calibri,Arial,sans-serif;margin:24px;background:#fff"><div style="font-size:18px;margin-bottom:10px">${esc(title)}</div>
  <table style="border-collapse:collapse;font-size:16px">${'<tr>' + head.map(h => `<th style="border:1px solid #bbb;background:#e8eef7;padding:6px 14px;text-align:left">${esc(h)}</th>`).join('') + '</tr>'}
  ${body.map((r, i) => `<tr data-i="${i}" ${mark && mark(r) ? 'data-mark="1"' : ''}>${r.map(x => `<td style="border:1px solid #ccc;padding:6px 14px">${esc(x)}</td>`).join('')}</tr>`).join('')}</table></body></html>`;
  await page.setContent(html); await page.waitForTimeout(800);
  const marked = []; for (const r of await page.locator('tr[data-mark="1"]').all()) marked.push({ box: await box(r), text: (await r.innerText()).replace(/\s+/g, ' ') });
  await shot(shotName, { marked, file: file.split('/').pop() });
}
export async function runA5(c) {
  const { mode, page, meta, shot, go, box, txt, preset } = c;
  if (mode === 'A5') {   // two overlapping 13-hour timesheets for Admin Shopview on 5 Oct 2026, made on screen; overwrite cancelled
    await go('/reports/punch-clock-activities', 10000);
    await newTimesheet(c, { staff: 'Admin Shopview', wo: 'S1-38220', line: 'Test DVI Line', start: 'Oct 5, 2026 08:00 AM', end: 'Oct 5, 2026 09:00 PM', shotName: '1-first-timesheet' });
    await page.waitForTimeout(3000);
    await newTimesheet(c, { staff: 'Admin Shopview', wo: 'S1-38220', line: 'Test DVI Line', start: 'Oct 5, 2026 08:00 AM', end: 'Oct 5, 2026 09:00 PM', shotName: '2-second-timesheet', onOverlap: 'cancel' });
  }
  if (mode === 'A5x') {  // probe: what does Cancel on "Confirm Overwrite" leave behind? every non-GET request logged
    const log = []; page.on('response', r => { if (r.request().method() !== 'GET' && r.url().includes('/api/')) log.push(`${r.status()} ${r.request().method()} ${r.url().replace(/^.*\/api/, '')}`); });
    await go('/reports/punch-clock-activities', 10000);
    await newTimesheet(c, { staff: 'Admin Shopview', wo: 'S1-38220', line: 'Test DVI Line', start: 'Oct 5, 2026 08:00 AM', end: 'Oct 5, 2026 09:00 PM', shotName: '1-second-timesheet', onOverlap: 'cancel' });
    meta.log_after_overwrite_cancel = [...log];
    const d = page.locator('.q-dialog').filter({ hasText: 'New Timesheet' }).last();
    await shot('2-after-cancel', { dlg: await box(d) });
    await d.locator('[data-test-id="button_cancel_timesheet"]').click().catch(e => meta.cancelErr = String(e).slice(0, 120)); await page.waitForTimeout(5000);
    meta.log_after_dialog_cancel = [...log];
    await preset('this_month');
    meta.ts_rows = (await page.locator('tbody tr').filter({ hasText: 'S1-38220' }).allInnerTexts()).map(x => x.replace(/\s+/g, ' '));
    await shot('3-ta-after', {});
  }
  if (mode === 'A5y') {  // probe: does a timesheet that overlaps a RUNNING clock get the overlap check?
    const fmt = d => d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/,(?= \d{2}:)/, '');
    const t = m => { const d = new Date(Date.now() - m * 60000); d.setSeconds(0, 0); return fmt(d); };
    const log = []; page.on('response', r => { if (r.request().method() !== 'GET' && /technician-tasks|timesheet/.test(r.url())) log.push(`${r.status()} ${r.request().method()} ${r.url().replace(/^.*\/api/, '')}`); });
    await go('/reports/punch-clock-activities', 10000);
    meta.run_start = t(30); await newTimesheet(c, { staff: 'Admin Shopview', wo: 'S1-38220', line: 'Test DVI Line', start: meta.run_start, end: '', shotName: null });
    meta.log1 = [...log]; meta.ow1 = meta.overwrite_text || null; meta.overwrite_text = null;
    meta.man = [t(60), t(5)]; await newTimesheet(c, { staff: 'Admin Shopview', wo: 'S1-38220', line: 'Test DVI Line', start: meta.man[0], end: meta.man[1], shotName: '1-overlapping-entry', onOverlap: 'cancel' });
    meta.log2 = [...log]; meta.ow2 = meta.overwrite_text || null;
    await preset('today');
    meta.ts_rows = (await page.locator('tbody tr').filter({ hasText: 'S1-38220' }).allInnerTexts()).map(x => x.replace(/\s+/g, ' '));
    await shot('2-ta-today', {});
  }
  if (mode === 'A5z') {  // clock out the running timesheet from the header timer (the customer's own Stop button)
    const log = []; page.on('response', r => { if (r.request().method() !== 'GET' && /technician-tasks|timesheet|clock/.test(r.url())) log.push(`${r.status()} ${r.request().method()} ${r.url().replace(/^.*\/api/, '')}`); });
    await go('/reports/punch-clock-activities', 10000);
    const hdr = page.locator('header'); meta.header = await txt(hdr);
    const stopBtn = hdr.locator('button, .q-btn, [role="button"]').filter({ hasText: /S1-38220|\d\d:\d\d:\d\d/ }).first();
    meta.stopCount = await stopBtn.count();
    await shot('0-header-running', { stop: await box(stopBtn) });
    await stopBtn.click().catch(e => meta.stopErr = String(e).slice(0, 150)); await page.waitForTimeout(8000);
    const st = page.locator('main button, main .q-btn').filter({ hasText: /^\s*Stop\s*$/ }).first(); meta.stopLine = await st.count();
    await st.click().catch(e => meta.stopErr2 = String(e).slice(0, 150)); await page.waitForTimeout(4000);
    meta.dlg1 = (await page.locator('.q-dialog').allInnerTexts().catch(() => [])).map(x => x.replace(/\n+/g, ' | ').slice(0, 600));
    await shot('1b-stop-dialog', {});
    const d = page.locator('.q-dialog').last();
    if (await d.count()) { const ta = d.locator('textarea, input[type="text"]').first(); if (await ta.count()) { await ta.fill('ZZAUTOTEST p2a clock out'); await page.waitForTimeout(500); }
      const ok = d.locator('button').filter({ hasText: /Stop|Save|Clock Out|Confirm|Submit|Done/i }).last(); meta.okBtn = await txt(ok); await ok.click().catch(e => meta.okErr = String(e).slice(0, 150)); await page.waitForTimeout(5000); }
    meta.dlg2 = (await page.locator('.q-dialog').allInnerTexts().catch(() => [])).map(x => x.replace(/\n+/g, ' | ').slice(0, 400)); meta.stoplog = log;
    meta.after_click = (await page.locator('.q-dialog, .q-menu').allInnerTexts().catch(() => [])).map(x => x.replace(/\n+/g, ' | ').slice(0, 500));
    await shot('1-after-stop-click', {});
  }
  if (mode === 'A5b') {  // read: the two overlapping rows on Timesheet Activities (Today, Admin Shopview), then the export for Today
    await go('/reports/punch-clock-activities', 10000);
    await preset('today');
    const rows = page.locator('tbody tr').filter({ hasText: 'Admin Shopview' });
    meta.ts_rows = (await rows.allInnerTexts()).map(x => x.replace(/\s+/g, ' '));
    const bx = []; for (let i = 0; i < await rows.count(); i++) bx.push({ box: await box(rows.nth(i)), text: (await rows.nth(i).innerText()).replace(/\s+/g, ' ') });
    await shot('3-ta-two-rows', { rows: bx });
    const f = await exportPayroll(c, { range: 'Today', shotName: '4-export' });
    await renderCsv(c, f, { title: `${f.split('/').pop()}  (downloaded from Reports > Export Reports, DVI Test, Report Name: Payroll Timesheet, Date range: Today = 28 Oct 2026)`, keep: null, mark: r => r[1] === '2026-10-28', shotName: '5-export-file' });
  }
  if (mode === 'A5c') {  // Heavy Duty is not this file's location; see A5HD
  }
}
