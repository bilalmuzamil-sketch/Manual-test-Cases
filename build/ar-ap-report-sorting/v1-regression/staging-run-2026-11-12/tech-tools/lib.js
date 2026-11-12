// Screen helpers for the live run. Every step is done through the user interface (menu, chips, arrows,
// export menu); the report API is never used to decide a verdict.
const fs = require('fs'); const path = require('path');
const { open } = require('./env.js');
const EVID = process.env.EVID || path.resolve(__dirname, '../shots');
const NAV = { 'A/R Aging Summary': 'report_nav_aging_summary_report', 'A/R Aging Detail': 'report_nav_aging_detail_report',
  'A/R Aging Collection': 'report_nav_aging_collection_report', 'A/P Aging Summary': 'report_nav_ap_aging_summary_report',
  'A/P Aging Detail': 'report_nav_ap_aging_detail_report', 'A/P Unpaid Invoices': 'report_nav_ap_unpaid_invoices_report',
  'Inventory Value': 'report_nav_inventory_value', 'Parts Velocity': 'report_nav_parts_velocity',
  'Technician Utilization': 'report_nav_technician_utilization', 'Work In Progress': 'report_nav_work_in_progress' };
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function settle(page, ms = 1200) { try { await page.waitForLoadState('networkidle', { timeout: 15000 }); } catch (e) {} await sleep(ms); }
async function reportsHome(page, app) { await page.goto(app + '/reports', { waitUntil: 'domcontentloaded' }); await settle(page, 1500); }
async function nav(page, name) {
  const tid = NAV[name]; await page.click(`[data-test-id="${tid}"]`); await settle(page, 1800);
  await page.waitForSelector('tr[data-test-id], [class*="no-data"], .q-table__bottom--nodata', { timeout: 45000 }).catch(() => {});
}
async function title(page) {
  return page.evaluate(() => { const m = document.querySelector('main[data-test-id^="page_"]') || document.querySelector('main');
    return m ? m.innerText.split('\n').map((x) => x.trim()).filter(Boolean)[0] : ''; });
}
async function chip(page, name) { const el = page.locator(`[data-test-id="filter_chip_${name}"]`).first(); return (await el.count()) ? (await el.innerText()).replace(/\s+/g, ' ').replace(/calendar_today|person|hourglass_empty|place|keyboard_arrow_down|cancel|store/g, '').trim() : null; }
// Set the date chip through its calendar: month/year arrows, then the day button.
async function setDate(page, iso) {
  const [y, m, d] = iso.split('-').map(Number);
  await page.click('[data-test-id="filter_chip_asOfDate"]'); await sleep(700);
  const menu = page.locator('.q-menu').last();
  for (let i = 0; i < 400; i++) {
    const hdr = await menu.locator('.q-date__navigation').allInnerTexts();
    const t = hdr.join(' ');
    const curM = MONTHS.findIndex((x) => t.includes(x)) + 1; const curY = Number((t.match(/\b(19|20)\d{2}\b/) || [])[0]);
    if (curM === m && curY === y) break;
    const diff = (y - curY) * 12 + (m - curM);
    const lbl = Math.abs(diff) >= 12 ? (diff < 0 ? 'Previous year' : 'Next year') : (diff < 0 ? 'Previous month' : 'Next month');
    const b = menu.locator(`button[aria-label="${lbl}"]`);
    if (await b.isDisabled()) return { ok: false, why: `${lbl} is disabled (cannot reach ${iso})` };
    await b.click(); await sleep(350);
  }
  await sleep(900);
  let day = menu.locator(`button[aria-label="${d} ${MONTHS[m - 1]} ${y}"]`);
  if (!(await day.count())) {  // older Quasar (production V1): day buttons carry only their number
    day = menu.locator('.q-date__calendar-days .q-date__calendar-item').filter({ hasText: new RegExp(`^${d}$`) }).locator('button').first();
    if (!(await day.count())) { const outItem = menu.locator('.q-date__calendar-days .q-date__calendar-item--out').filter({ hasText: new RegExp(`^${d}$`) }); if (await outItem.count()) return { ok: false, why: `day ${iso} is greyed out (disabled)` }; }
  }
  if (!(await day.count())) return { ok: false, why: `no day button for ${iso}` };
  const disabled = await day.evaluate((e) => e.disabled || e.classList.contains('disabled') || e.getAttribute('aria-disabled') === 'true' || !!e.closest('.q-date__calendar-item--out'));
  if (disabled) return { ok: false, why: `day ${iso} is greyed out (disabled)` };
  await day.click({ timeout: 10000 }).catch(async () => { await sleep(1500); await menu.locator(`button[aria-label="${d} ${MONTHS[m - 1]} ${y}"]`).click({ force: true }); }); await sleep(400);
  if (await page.locator('.q-menu').count()) { await page.keyboard.press('Escape'); }
  await settle(page, 1500);
  return { ok: true, chip: await chip(page, 'asOfDate') };
}
async function pickParty(page, kind, name) {
  await page.click(`[data-test-id="filter_chip_${kind}"]`); await sleep(700);
  await page.fill(`[data-test-id="filter_search_${kind}"] input, input[data-test-id="filter_search_${kind}"]`, name).catch(async () => {
    await page.locator(`[data-test-id="filter_search_${kind}"]`).first().fill(name); });
  await settle(page, 1200);
  const opt = page.locator(`.q-menu [data-test-id^="filter_option_${kind}_"]`, { hasText: name }).first();
  for (let i = 0; i < 12 && !(await opt.count()); i++) await sleep(700);
  if (!(await opt.count())) { await page.keyboard.press('Escape'); return { ok: false, why: `"${name}" not offered in the ${kind} chip` }; }
  await opt.click(); await sleep(500); await page.keyboard.press('Escape'); await settle(page, 1500);
  return { ok: true, chip: await chip(page, kind), url: page.url() };
}
// Open every bucket/group with its arrow button and scroll so every lazy page loads.
async function openAll(page) {
  const toggles = page.locator('button[data-test-id^="button_aging_"][data-test-id*="_toggle_"], button[data-test-id^="button_ap_"][data-test-id*="_toggle_"]');
  const n = await toggles.count(); let opened = 0;
  for (let i = 0; i < n; i++) { const b = toggles.nth(i); const txt = await b.innerText(); if (txt.includes('keyboard_arrow_right') && !(await b.isDisabled().catch(() => true))) { try { await b.click({ timeout: 5000 }); opened++; await sleep(900); } catch (e) {} } }
  await scrollAll(page); return opened;
}
async function scrollAll(page) { for (let i = 0; i < 25; i++) { const before = await page.locator('tr[data-test-id]').count(); await page.mouse.wheel(0, 20000); await page.evaluate(() => { document.querySelectorAll('.q-table__middle, .scroll, main').forEach((e) => { e.scrollTop = e.scrollHeight; }); window.scrollTo(0, document.body.scrollHeight); }); await settle(page, 700); if ((await page.locator('tr[data-test-id]').count()) === before) break; } }
async function rows(page) {
  return page.evaluate(() => [...document.querySelectorAll('tr[data-test-id]')].map((tr) => {
    const cells = {}; tr.querySelectorAll('[data-test-id]').forEach((c) => { const id = c.getAttribute('data-test-id'); const k = id.includes('_cell_') ? id.split('_cell_').pop() : (id.endsWith('_total_label') ? 'total_label' : null); if (k && !(k in cells)) cells[k] = c.innerText.replace(/\s+/g, ' ').trim(); });
    const link = tr.querySelector('a[data-test-id^="link_"]'); const plain = tr.querySelector('span[data-test-id^="text_"]');
    return { tid: tr.getAttribute('data-test-id'), text: tr.innerText.replace(/\s+/g, ' ').trim(), cells, link: link ? { tid: link.getAttribute('data-test-id'), href: link.getAttribute('href'), text: link.innerText.trim() } : null, plain: plain ? plain.innerText.trim() : null };
  }));
}
async function shot(page, key, what) { const f = `${key} - ${what}.png`.replace(/[\/:]/g, '-'); await page.screenshot({ path: path.join(EVID, f), fullPage: true }); return f; }
function saveText(key, what, obj) { const f = `${key} - ${what}.json`.replace(/[\/:]/g, '-'); fs.writeFileSync(path.join(EVID, f), JSON.stringify(obj, null, 1)); return f; }
async function exportFile(page, prefix, kind, key, what) {
  await page.click(`[data-test-id="btn_dropdown_${prefix}_export"]`); await sleep(700);
  const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }).catch(() => null), page.click(`[data-test-id="action_${prefix}_export_${kind}"]`)]);
  if (!dl) return { ok: false };
  const f = `${key} - ${what}.${kind}`; await dl.saveAs(path.join(EVID, f)); return { ok: true, file: f, path: path.join(EVID, f), suggested: dl.suggestedFilename() };
}
async function notices(page) { return page.evaluate(() => [...document.querySelectorAll('.q-notification, [role="alert"], .q-banner')].map((e) => e.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean)); }
module.exports = { open, reportsHome, nav, title, chip, setDate, pickParty, openAll, scrollAll, rows, shot, saveText, exportFile, notices, settle, sleep, EVID };
