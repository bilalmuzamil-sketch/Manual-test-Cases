// p2a screen modes, driven by ev_p2a.mjs (which handles Rule 99 zones and meta.json). SECRET-FREE.
export async function run(c) {
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
  if (mode === 'A5HD') {   // Export Reports -> Payroll Timesheet, Heavy Duty, Last Month (= September 2026)
    await go('/reports/punch-clock-activities', 10000);
    const exp = page.getByRole('button', { name: /Export Reports/i }).first();
    meta.export_btn = await exp.count();
    await exp.click(); await page.waitForTimeout(3000);
    const dlg = page.locator('.q-dialog').last();
    meta.dialog = (await dlg.innerText()).replace(/\n+/g, ' | ').slice(0, 600);
    await shot('0-export-dialog', { dlg: await box(dlg) });
  }
}
