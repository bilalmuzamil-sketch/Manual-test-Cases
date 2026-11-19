// Release day 19 Nov: screen smoke of all six aging reports on staging, 1440 px, read-only (logout blocked by env.js).
// Per report: loads with rows and Totals, no console errors / 5xx, info icon, Export menu items, Location chip,
// header click re-sorts (and back), Expand all / Collapse all on grouped reports, a document link has a target.
const path = require('path'); const fs = require('fs');
const lib = require(path.resolve(__dirname, '../../v1-regression/staging-run-2026-11-12/tech-tools/lib.js'));
const OUT = path.resolve(__dirname, '../screen/smoke-2026-11-19'); fs.mkdirSync(OUT, { recursive: true });
const R = { utc_start: new Date().toISOString(), reports: {} };
const SLUGS = ['ar-aging-summary', 'ar-aging-detail', 'ar-aging-collection', 'ap-aging-summary', 'ap-aging-detail', 'ap-unpaid-invoices'];
(async () => {
  const { browser, page, app } = await lib.open('staging', { width: 1440 });
  const errs = []; page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 160)); });
  const bad = []; page.on('response', (r) => { if (r.status() >= 500 && r.url().includes('/api/')) bad.push(`${r.status()} ${r.url().replace(/\?.*/, '').slice(-80)}`); });
  for (const slug of SLUGS) {
    const x = {}; errs.length = 0; bad.length = 0;
    await page.goto(`${app}/reports/${slug}`, { waitUntil: 'domcontentloaded' }); await lib.settle(page, 4000);
    R.build = R.build || await page.locator('meta[name="app-version"]').getAttribute('content');
    x.title = (await page.locator('h1, .text-h5, .report-title').first().innerText().catch(() => '')).trim();
    x.chips = await page.locator('[data-test-id^="filter_chip_"]').allInnerTexts().then((a) => a.map((t) => t.replace(/\s+/g, ' ').replace(/calendar_today|person|hourglass_empty|place|keyboard_arrow_down|local_shipping/g, '').trim()));
    x.headers = await page.locator('thead th').allInnerTexts().then((a) => a.map((t) => t.replace(/arrow_drop_(up|down)|keyboard_arrow_(right|down)/g, '').replace(/\s+/g, ' ').trim()).filter(Boolean));
    x.rowsBefore = await page.locator('tbody tr').count();
    x.totals = await page.locator('tr', { hasText: 'Totals' }).last().innerText().then((t) => t.replace(/\s+/g, ' ')).catch(() => null);
    const firstRows = async () => (await page.locator('tbody tr').allInnerTexts()).slice(0, 4).map((t) => t.replace(/\s+/g, ' ').slice(0, 60));
    const before = await firstRows();
    // header click on the 2nd sortable heading (not the opening one), then twice more back to the first state
    const th = page.locator('thead th').nth(slug.includes('summary') ? 2 : 1);
    await th.click().catch(() => {}); await lib.settle(page, 2500); const afterOne = await firstRows();
    x.headerSortChangesOrder = JSON.stringify(afterOne) !== JSON.stringify(before);
    await page.goto(`${app}/reports/${slug}`, { waitUntil: 'domcontentloaded' }); await lib.settle(page, 3500);
    // grouped reports: Expand all, then Collapse all (header chevron)
    const hdrChevron = page.locator('thead th').first().locator('button, i, .q-icon').filter({ hasText: /keyboard_arrow/ }).first();
    if (!slug.includes('summary') && await hdrChevron.count()) {
      const n0 = await page.locator('tbody tr').count(); await hdrChevron.click(); await lib.settle(page, 5000);
      const n1 = await page.locator('tbody tr').count(); x.expandAll = { before: n0, after: n1, grew: n1 > n0 };
      await page.screenshot({ path: `${OUT}/${slug}-expanded.png` });
      const link = page.locator('tbody a[href]').first(); x.firstDocLink = (await link.count()) ? { text: (await link.innerText()).trim(), href: await link.getAttribute('href') } : null;
      await hdrChevron.click(); await lib.settle(page, 2500); x.collapseAll = { after: await page.locator('tbody tr').count() };
      x.sidewaysScroll = await page.evaluate(() => { const t = document.querySelector('.q-table__middle'); return t ? t.scrollWidth > t.clientWidth + 1 : null; });
    } else {
      const link = page.locator('tbody a[href]').first(); x.firstNameLink = (await link.count()) ? { text: (await link.innerText()).trim(), href: await link.getAttribute('href') } : null;
    }
    // Export menu and info icon
    const more = page.locator('button[aria-label="Export report"], button:has-text("more_horiz")').first();
    if (await more.count()) { await more.click(); await lib.sleep(800); x.exportMenu = (await page.locator('.q-menu').last().innerText().catch(() => '')).replace(/\s+/g, ' ').trim(); await page.keyboard.press('Escape'); }
    x.infoIcon = (await page.locator('i:has-text("info"), [aria-label*="info" i], .q-icon:has-text("info_outline")').count()) > 0;
    await page.screenshot({ path: `${OUT}/${slug}.png` });
    x.consoleErrors = [...errs]; x.serverErrors = [...bad]; R.reports[slug] = x;
  }
  R.utc_end = new Date().toISOString(); fs.writeFileSync(`${OUT}/smoke-results.json`, JSON.stringify(R, null, 1)); await browser.close();
  for (const [s, x] of Object.entries(R.reports)) console.log(s, '| rows', x.rowsBefore, '| headerSortChanges', x.headerSortChangesOrder, '| expand', JSON.stringify(x.expandAll || '-'), '| collapse', JSON.stringify(x.collapseAll || '-'), '| link', JSON.stringify(x.firstDocLink || x.firstNameLink || null).slice(0, 90), '| export', (x.exportMenu || '').slice(0, 60), '| info', x.infoIcon, '| sideways', x.sidewaysScroll, '| consoleErr', x.consoleErrors.length, '| 5xx', x.serverErrors.length);
  console.log('build', R.build, R.utc_start, R.utc_end);
})().catch((e) => { console.error(e); process.exit(1); });
