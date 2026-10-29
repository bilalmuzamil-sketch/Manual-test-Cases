// Phase 2 Worker B screen evidence (Parts Velocity / Inventory Value). Rule 99: browser timezoneId = the location's zone,
// process TZ = the zone (asserted), session change-location'd to the zone by boot2; all three recorded in meta.json.
// deviceScaleFactor 2 so boxes feed annotate_v2.py. SECRET-FREE.
// Usage: TZ=<zone> node ev_p2b.mjs <PV_DVI|IV_DVI|PV_HD|WO_HD|WO_DVI|RET_CREATE|RET_PV|RET_CANCEL>
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const APP = 'https://app.staging.shopview.com';
const DVI = { wp: '39522bc6-abca-4f67-bd12-2840043c2d68', tz: 'America/Toronto', loc: 'DVI Test' };
const HD = { wp: 'b3c8c820-f815-4cf1-8938-10956c5ee71a', tz: 'Asia/Karachi', loc: 'Staging Heavy Duty - 9919' };
const mode = process.argv[2]; const M = /HD/.test(mode) ? HD : DVI;
if (process.env.TZ !== M.tz) { console.error(`run with TZ=${M.tz}`); process.exit(3); }
const OUT = `/tmp/cln/p2b/shots/${mode}`; fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await boot2('admin', { workplaceId: M.wp, timezone: M.tz,
  contextOptions: { viewport: { width: Number(process.env.VW || 1600), height: Number(process.env.VH || 1000) }, deviceScaleFactor: 2, timezoneId: M.tz, acceptDownloads: true } });
// fresh: no saved report views (IV/PV first visit), active location set
await page.evaluate(w => { for (const k of Object.keys(localStorage)) if (/report_table|velocity|inventory/i.test(k)) localStorage.removeItem(k); localStorage.setItem('location', JSON.stringify(w.wp)); localStorage.setItem('timezone', JSON.stringify(w.tz)); }, M);
// NOTE (found 29 Oct): the app reads the location's zone from localStorage 'timezone' (set by the location switcher);
// boot2 does not set it, and without it report date windows fall back to UTC. Setting it reproduces a real user.
const meta = { mode, location: M.loc, location_tz: M.tz, process_TZ: process.env.TZ || null,
  process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, observed_at_utc: new Date().toISOString(), shots: {}, reqs: [] };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
meta.browser_now = await page.evaluate(() => new Date().toString());
meta.app_timezone_key = await page.evaluate(() => localStorage.getItem('timezone'));
page.on('request', r => { const u = r.url(); if (/reports\/(parts-velocity|inventory-value)/.test(u)) meta.reqs.push(decodeURIComponent(u.replace(/^.*\/api\//, ''))); });
const box = async loc => { const b = await loc.first().boundingBox().catch(() => null); return b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) }; };
const txt = async loc => (await loc.first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
const save = () => fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
const shot = async (name, extra = {}, full = false) => { await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full }); meta.shots[name] = { ...extra, header: await txt(page.locator('header')) }; save(); };
const ver = async () => { meta.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null); };
const menu = () => page.locator('.q-menu').last();
const heads = async sel => (await page.locator(`${sel} thead th`).allInnerTexts()).map(s => s.replace(/\s+/g, ' ').trim());
const headBoxes = async sel => { const ths = page.locator(`${sel} thead th`); const n = await ths.count(); const o = []; for (let i = 0; i < n; i++) o.push({ t: (await ths.nth(i).innerText()).replace(/\s+/g, ' ').trim(), b: await box(ths.nth(i)) }); return o; };
const rowInfo = async (sel, text) => { const r = page.locator(`${sel} tbody tr`).filter({ hasText: text }); const n = await r.count(); const out = [];
  for (let i = 0; i < n; i++) { const cells = r.nth(i).locator('td'); const c = await cells.count(); const cs = []; for (let k = 0; k < c; k++) cs.push({ t: (await cells.nth(k).innerText()).replace(/\s+/g, ' ').trim(), b: await box(cells.nth(k)) }); out.push({ row: await box(r.nth(i)), cells: cs }); } return out; };
const search = async term => { let s = page.locator('input[placeholder*="Search"]').filter({ visible: true }).first();
  if (!(await s.count())) { await page.locator('.q-page button').filter({ hasText: 'Search' }).first().click().catch(e => meta.searchErr = e.message.split('\n')[0]); await page.waitForTimeout(1500); }
  const inp = page.locator('.q-page input').filter({ visible: true }); meta.searchInputs = await inp.count();
  const focused = await page.evaluate(() => document.activeElement && document.activeElement.tagName);
  if (focused === 'INPUT') await page.keyboard.type(term); else await inp.first().fill(term);
  await page.waitForTimeout(9000); };
const filterBand = async () => (await page.locator('.q-page').first().innerText().catch(() => '')).split('\n').filter(Boolean).slice(0, 30);
const chips = () => page.locator('.q-page button, .q-page [role="button"]');
const PV = '[data-test-id="table_parts_velocity"]';

async function openPV() {
  await page.goto(APP + '/reports/parts-velocity', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector(PV, { timeout: 90000 }); await page.waitForTimeout(12000); await ver();
}
async function openIV() {
  await page.goto(APP + '/reports/inventory-value', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('table thead th', { timeout: 90000 }); await page.waitForTimeout(12000); await ver();
}
async function toggleColumns(want) { // open the column selector and switch on the named columns
  const btn = page.locator('[data-test-id*="column"], button[aria-label*="olumn"]').first();
  meta.colBtn = await txt(btn); await btn.click().catch(e => meta.colErr = e.message.split('\n')[0]); await page.waitForTimeout(1500);
  meta.colMenu = (await menu().innerText().catch(() => '')).split('\n').filter(Boolean);
  for (const w of want) { const it = menu().locator('.q-item, label, [role="checkbox"], [role="option"]').filter({ hasText: new RegExp('^\\s*' + w + '\\s*$') }).first();
    meta['colItem_' + w] = await it.count(); meta['colItemHtml_' + w] = (await it.evaluate(e => e.outerHTML).catch(() => '')).slice(0, 400);
    if (await it.count()) { await it.locator('[role="switch"]').first().click(); await page.waitForTimeout(1500); meta['colChecked_' + w] = await it.locator('[role="switch"]').first().getAttribute('aria-checked'); } else meta['colMissing_' + w] = true; }
  await page.screenshot({ path: `${OUT}/col-menu.png` });
  const apply = menu().getByText(/^(Apply|Done|Save)$/); meta.colApply = await apply.count(); if (await apply.count()) await apply.first().click();
  await page.mouse.click(5, 600); await page.waitForTimeout(6000);
}

if (mode === 'PV_DVI') {
  await openPV();
  meta.pv_headers = await headBoxes(PV);
  meta.band = await filterBand();
  meta.chipTexts = (await chips().allInnerTexts()).map(s => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const dateChip = chips().filter({ hasText: /Last 90 days/i }).first();
  meta.dateChip = { t: await txt(dateChip), b: await box(dateChip) };
  const locChip = chips().filter({ hasText: /Location/i }).first();
  meta.locChip = { t: await txt(locChip), b: await box(locChip) };
  await shot('1-pv-default');
  await dateChip.click(); await page.waitForTimeout(2000);
  meta.dateMenu = (await menu().innerText().catch(() => '')).split('\n').filter(Boolean);
  meta.dateMenuBox = await box(menu());
  const ind = menu().locator('[data-test-id*="range_indicator"], [class*="range"]');
  meta.rangeIndicator = { t: await txt(ind), b: await box(ind) };
  await shot('2-pv-date-menu');
  // Custom: what range does the calendar show for Last 90 days?
  await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
  await search('ZZAUTOTEST');
  meta.rows_PV1 = await rowInfo(PV, 'ZZAUTOTEST-PV1-10282011');
  meta.rows_SO1 = await rowInfo(PV, 'ZZAUTOTEST-SO1-10282011');
  meta.rows_SO2 = await rowInfo(PV, 'ZZAUTOTEST-SO2-10282011');
  meta.pv_headers_search = await headBoxes(PV);
  await shot('3-pv-zzautotest');
  // location menu
  await locChip.click().catch(() => {}); await page.waitForTimeout(1500);
  meta.locMenu = (await menu().innerText().catch(() => '')).split('\n').filter(Boolean);
  await shot('4-pv-location-menu');
  await page.keyboard.press('Escape');
}
if (mode === 'PV_B1') {
  await openPV();
  const dateChip = chips().filter({ hasText: /Last 90 days/i }).first();
  meta.dateChip = { t: await txt(dateChip), b: await box(dateChip) };
  await dateChip.click(); await page.waitForTimeout(2000);
  await menu().getByText('Custom', { exact: true }).first().click(); await page.waitForTimeout(2500);
  meta.customMenu = (await menu().innerText().catch(() => '')).split('\n').filter(Boolean);
  meta.customMenuBox = await box(menu());
  const sel = menu().locator('.q-date__calendar-item--in .q-date__range, .q-date__range-from, .q-date__range-to, .q-date__edit-range');
  meta.rangeCells = await sel.count();
  meta.inputs = await menu().locator('input').evaluateAll(es => es.map(e => [e.getAttribute('aria-label') || e.placeholder || e.name, e.value]));
  await shot('1-pv-custom-open');
  await page.keyboard.press('Escape'); await page.waitForTimeout(1000);
  const more = page.locator('.q-page button').filter({ hasText: 'more_horiz' }).first();
  await more.click().catch(e => meta.moreErr = e.message.split('\n')[0]); await page.waitForTimeout(1500);
  meta.moreMenu = (await menu().innerText().catch(() => '')).split('\n').filter(Boolean);
  await shot('2-pv-more-menu');
  for (const kind of ['PDF', 'CSV']) {
    const it = menu().getByText(new RegExp(kind)).first();
    if (await it.count()) { const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 90000 }).catch(e => { meta['dlErr' + kind] = e.message.split('\n')[0]; return null; }), it.click()]);
      if (dl) { const p = `${OUT}/pv-export.${kind.toLowerCase()}`; await dl.saveAs(p); meta['dl' + kind] = dl.suggestedFilename(); } }
    await page.keyboard.press('Escape'); await page.waitForTimeout(1500); await more.click().catch(() => {}); await page.waitForTimeout(1500);
  }
}
if (mode === 'IV_DVI') {
  await openIV();
  meta.iv_headers = await headBoxes('table');
  meta.band = await filterBand();
  await shot('1-iv-first-visit');
  // downloads
  meta.exportButtons = (await page.locator('button').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').trim()).filter(s => /export|download|csv|pdf|print/i.test(s));
  const ex = page.locator('button').filter({ hasText: /Export|Download/i }).first();
  meta.exportBox = await box(ex);
  if (await ex.count()) {
    await ex.click(); await page.waitForTimeout(1500);
    meta.exportMenu = (await menu().innerText().catch(() => '')).split('\n').filter(Boolean);
    await shot('2-iv-export-menu');
    const csv = menu().getByText(/CSV/i).first();
    if (await csv.count()) {
      const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }).catch(e => { meta.dlErr = e.message.split('\n')[0]; return null; }), csv.click()]);
      if (dl) { const p = `${OUT}/iv-export.csv`; await dl.saveAs(p); meta.csvName = dl.suggestedFilename(); meta.csvHead = fs.readFileSync(p, 'utf8').split('\n').slice(0, 3); }
    }
    await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
    await ex.click(); await page.waitForTimeout(1500);
    const pdf = menu().getByText(/PDF/i).first();
    if (await pdf.count()) {
      const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 90000 }).catch(e => { meta.pdfErr = e.message.split('\n')[0]; return null; }), pdf.click()]);
      if (dl) { const p = `${OUT}/iv-export.pdf`; await dl.saveAs(p); meta.pdfName = dl.suggestedFilename(); }
    }
  }
}
const pickPreset = async label => { const dc = chips().filter({ hasText: /Date:/ }).first(); await dc.click(); await page.waitForTimeout(1500);
  await menu().getByText(label, { exact: true }).first().click(); await page.waitForTimeout(800);
  const ap = menu().getByText(/^Apply$/); if (await ap.count()) await ap.first().click().catch(() => {});
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(8000);
  meta.dateChipAfter = { t: await txt(chips().filter({ hasText: /Date:/ }).first()), b: await box(chips().filter({ hasText: /Date:/ }).first()) }; };
if (mode === 'IV_DL') {
  await openIV();
  const more = page.locator('.q-page button').filter({ hasText: 'more_horiz' }).first();
  for (const kind of ['PDF', 'CSV']) {
    await more.click().catch(e => meta.moreErr = e.message.split('\n')[0]); await page.waitForTimeout(1500);
    meta.moreMenu = (await menu().innerText().catch(() => '')).split('\n').filter(Boolean);
    const it = menu().getByText(new RegExp(kind)).first();
    if (await it.count()) { const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 120000 }).catch(e => { meta['dlErr' + kind] = e.message.split('\n')[0]; return null; }), it.click()]);
      if (dl) { const p = `${OUT}/iv-export.${kind.toLowerCase()}`; await dl.saveAs(p); meta['dl' + kind] = dl.suggestedFilename(); } }
    await page.keyboard.press('Escape'); await page.waitForTimeout(1500);
  }
}
if (mode === 'RET_CREATE') { // Parts -> Returns -> Create Return, ZZAUTOTEST-PV1-10282011 x1 to vendor 123 Cannabis Forestlawn
  const stage = process.argv[3] || 'look';
  await page.goto(APP + '/parts/returns', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000); await ver();
  meta.listTop = (await txt(page.locator('main'))).slice(0, 1500);
  await shot('0-returns-list');
  await page.locator('main button').filter({ hasText: 'Create Return' }).first().click(); await page.waitForTimeout(6000);
  meta.createUrl = page.url(); meta.createText = (await txt(page.locator('main'))).slice(0, 1500);
  await shot('1-create-return-empty');
  if (stage !== 'look') {
    // vendor
    const v = page.locator('[data-test-id="select_vendor"]').first();
    await v.click(); await page.waitForTimeout(800); await page.keyboard.type('123 Cannabis'); await page.waitForTimeout(3000);
    meta.vendorMenu = (await menu().innerText().catch(() => '')).split('\n').filter(Boolean).slice(0, 8);
    await menu().getByText('123 Cannabis Forestlawn').first().click(); await page.waitForTimeout(1500);
    await page.locator('input[aria-label="Packaging Slip"]').first().fill('ZZAUTOTEST P2B vendor return').catch(e => meta.slipErr = e.message.split('\n')[0]);
    // part
    const ps = page.locator('[data-test-id="create_return_part_select"]').first();
    await ps.click().catch(() => {}); await page.waitForTimeout(600); await page.keyboard.type('ZZAUTOTEST-PV1-10282011'); await page.waitForTimeout(5000);
    meta.partMenu = (await menu().innerText().catch(() => '')).split('\n').filter(Boolean).slice(0, 10);
    await shot('2-part-menu');
    await menu().locator('.q-item').filter({ hasText: 'ZZAUTOTEST-PV1-10282011' }).first().click(); await page.waitForTimeout(4000);
    meta.rowText = (await txt(page.locator('[data-test-id="table_create_return"] tbody'))).slice(0, 800);
    const q = page.locator('[data-test-id^="input_return_qty_0_"] input, input[data-test-id^="input_return_qty_0_"]').first();
    meta.qtyCount = await q.count();
    if (await q.count()) { await q.fill('1'); } else { const q2 = page.locator('[data-test-id="table_create_return"] input[type="number"]').first(); await q2.fill('1'); }
    await page.waitForTimeout(1500);
    meta.rowText2 = (await txt(page.locator('[data-test-id="table_create_return"] tbody'))).slice(0, 800);
    await shot('3-filled');
    if (stage === 'save') {
      await page.locator('button').filter({ hasText: 'Save Return' }).first().click(); await page.waitForTimeout(8000);
      meta.afterSaveUrl = page.url(); meta.afterSave = (await txt(page.locator('main'))).slice(0, 1500);
      meta.dialogs = (await page.locator('.q-dialog').allInnerTexts()).map(s => s.slice(0, 400));
      await shot('4-after-save');
    }
  }
}
if (mode === 'RET_CANCEL') { // cancel the ZZAUTOTEST P2B manual vendor return (restores stock)
  meta.posts = []; page.on('response', async r => { if (r.request().method() !== 'GET' && /\/api\//.test(r.url())) meta.posts.push([r.request().method(), r.url().replace(/^.*\/api\//, ''), r.status(), (await r.text().catch(() => '')).slice(0, 300)]); });
  await page.goto(APP + '/parts/returns', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000); await ver();
  const row = page.locator('tbody tr').filter({ hasText: 'ZZAUTOTEST P2B vendor return' }).first();
  meta.rowBefore = await txt(row);
  await row.locator('button').last().click(); await page.waitForTimeout(1500);
  meta.rowMenu = (await menu().innerText().catch(() => '')).split('\n').filter(Boolean);
  await menu().getByText(/Cancel Return|Delete Return/).first().click(); await page.waitForTimeout(2000);
  meta.dialog = (await page.locator('.q-dialog').last().innerText().catch(() => '')).split('\n').filter(Boolean);
  await shot('1-cancel-dialog');
  await page.locator('.q-dialog').last().getByRole('button', { name: 'Yes', exact: true }).click().catch(e => meta.confErr = e.message.split('\n')[0]);
  await page.waitForTimeout(6000);
  meta.after = (await txt(page.locator('main'))).slice(0, 1200);
  await shot('2-after-cancel');
}
if (mode === 'PV_HD') {
  await openPV();
  if (process.argv[3]) await pickPreset(process.argv[3]);
  meta.band = await filterBand();
  await search('N000000001069');
  meta.pv_headers = await headBoxes(PV);
  meta.rows = await rowInfo(PV, 'N000000001069');
  await shot('1-pv-n1069-last90');
}
if (mode === 'WO_HD') {
  const id = process.argv[3]; const tab = process.argv[4] || 'lines';
  await page.goto(`${APP}/workorders/${id}/${tab}`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(12000); await ver();
  const t = page.locator('main').getByText(process.argv[5] || 'N000000001069', { exact: false });
  meta.hits = await t.count(); await t.first().scrollIntoViewIfNeeded().catch(() => {}); await page.evaluate(() => window.scrollBy(0, -250)); await page.waitForTimeout(1500);
  meta.hit = { b: await box(t), t: await txt(t) };
  meta.main = (await txt(page.locator('main'))).slice(0, 4000);
  await shot('1-wo');
}
if (mode === 'WO_DVI') {
  const id = process.argv[3]; const tab = process.argv[4] || 'finance';
  await page.goto(`${APP}/workorders/${id}/${tab}`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(12000); await ver();
  meta.main = (await txt(page.locator('main'))).slice(0, 4000);
  const t = page.locator('main').getByText(process.argv[5] || 'ZZAUTOTEST', { exact: false });
  meta.hits = await t.count(); meta.hit = { b: await box(t), t: await txt(t) };
  await shot('1-wo-' + tab);
}
if (mode === 'RET_PV') { // PV with Units Returned turned on, searched for the seeded stocked part
  await openPV();
  await toggleColumns(['Units Returned']);
  await search('ZZAUTOTEST-PV1');
  meta.pv_headers = await headBoxes(PV);
  meta.rows_PV1 = await rowInfo(PV, 'ZZAUTOTEST-PV1-10282011');
  await shot('1-pv-units-returned-' + (process.argv[3] || 'x'));
}
if (mode === 'RET_LIST') {
  await page.goto(APP + '/parts/returns', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(12000); await ver();
  meta.main = (await txt(page.locator('main'))).slice(0, 3000);
  meta.buttons = (await page.locator('main button').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
  await shot('1-returns-list');
}
save(); await browser.close();
console.log(JSON.stringify(meta, null, 1).slice(0, 9000));
