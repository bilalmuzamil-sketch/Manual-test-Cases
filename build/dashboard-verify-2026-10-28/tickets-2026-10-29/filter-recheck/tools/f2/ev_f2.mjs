// Filter recheck F2 — screen side (Parts Velocity / Inventory Value / Parts Returns). SECRET-FREE.
// Rule 99: browser timezoneId = location zone, process TZ = zone (asserted), boot2 change-location's its own session to
// the zone and sets the app's localStorage['timezone']; all four recorded in meta.json.
// FRESH CONTEXT: boot2 seeds only user / fe_permissions_wrapper / token / timezone. Nothing is cleared here, so what the
// page shows on entry IS the first-visit default; the storage snapshot proves no remembered key existed.
// Usage: TZ=<zone> node ev_f2.mjs <PV_DVI|PV_HD|IV_DVI|RET_CREATE|RET_PV|RET_CANCEL|RET_LIST> [arg]
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const APP = 'https://app.staging.shopview.com';
const DVI = { wp: '39522bc6-abca-4f67-bd12-2840043c2d68', tz: 'America/Toronto', loc: 'DVI Test' };
const HD = { wp: 'b3c8c820-f815-4cf1-8938-10956c5ee71a', tz: 'Asia/Karachi', loc: 'Staging Heavy Duty - 9919' };
const mode = process.argv[2]; const arg = process.argv[3] || ''; const M = (/HD/.test(mode) || process.env.LOC === 'HD') ? HD : DVI;
if (process.env.TZ !== M.tz) { console.error(`run with TZ=${M.tz}`); process.exit(3); }
const EV = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f2';
const OUT = `/tmp/cln/f2/shots/${mode}${arg ? '_' + arg : ''}`; fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await boot2('admin', { workplaceId: M.wp, timezone: M.tz,
  contextOptions: { viewport: { width: Number(process.env.VW || 1600), height: Number(process.env.VH || 1000) }, deviceScaleFactor: 2, timezoneId: M.tz, acceptDownloads: true } });
await page.evaluate(w => localStorage.setItem('location', JSON.stringify(w.wp)), M);   // the active location, as the switcher writes it
const meta = { mode, arg, location: M.loc, workplace_id: M.wp, location_tz: M.tz, process_TZ: process.env.TZ || null,
  process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, observed_at_utc: new Date().toISOString(), steps: {}, api: [], writes: [] };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
meta.browser_now = await page.evaluate(() => new Date().toString());
meta.app_timezone_key = await page.evaluate(() => localStorage.getItem('timezone'));
page.on('request', r => { const u = r.url(); if (/\/api\//.test(u) && !/sentry|analytics|segment|intercom/.test(u)) meta.api.push(r.method() + ' ' + decodeURIComponent(u.replace(/^.*?\/api\//, ''))); });
page.on('response', async r => { if (r.request().method() !== 'GET' && /\/api\//.test(r.url())) meta.writes.push([r.request().method(), r.url().replace(/^.*?\/api\//, ''), r.status(), (r.request().postData() || '').slice(0, 300), (await r.text().catch(() => '')).slice(0, 400)]); });
const save = () => fs.writeFileSync(`${OUT}/meta.json`, JSON.stringify(meta, null, 1));
const T = s => (s || '').replace(/\s+/g, ' ').trim();
const txt = async loc => T(await loc.first().innerText({ timeout: 5000 }).catch(() => ''));
const box = async loc => { const b = await loc.first().boundingBox().catch(() => null); return b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) }; };
const menu = () => page.locator('.q-menu').last();
const chips = () => page.locator('.q-page button, .q-page [role="button"]');
const storage = () => page.evaluate(() => ({ local: Object.fromEntries(Object.keys(localStorage).filter(k => !/^(user|fe_permissions_wrapper|token)$/.test(k)).map(k => [k, localStorage.getItem(k).slice(0, 300)])),
  session: Object.fromEntries(Object.keys(sessionStorage).map(k => [k, sessionStorage.getItem(k).slice(0, 300)])), url: location.href }));
const heads = async sel => (await page.locator(`${sel} thead th`).allInnerTexts()).map(T).filter(Boolean);
const rowsOf = async (sel, text) => { const hs = (await page.locator(`${sel} thead th`).allInnerTexts()).map(T); const r = page.locator(`${sel} tbody tr`).filter({ hasText: text }); const n = await r.count(); const o = [];
  for (let i = 0; i < n; i++) { const cs = (await r.nth(i).locator('td').allInnerTexts()).map(T); const d = {}; cs.forEach((c, k) => d[hs[k] || 'col' + k] = c); o.push(d); } return o; };
const chipTexts = async () => (await chips().allInnerTexts()).map(T).filter(s => /:/.test(s)).map(s => s.replace(/ ?(keyboard_arrow_down|cancel|calendar_today|category|list|local_shipping|inventory_2|place|event)/g, '').trim());
const step = async (name, sel, find = [], shotIt = true) => { const s = { chips: await chipTexts(), headers: sel ? await heads(sel) : [], storage: await storage(), rows: {} };
  for (const f of find) s.rows[f] = sel ? await rowsOf(sel, f) : [];
  s.notifications = (await page.locator('.q-notification').allInnerTexts().catch(() => [])).map(T);
  s.api_count = meta.api.length; meta.steps[name] = s; if (shotIt) await page.screenshot({ path: `${OUT}/${name}.png` }); save(); return s; };
const hdr = async () => { await page.keyboard.press('Escape').catch(() => {}); const a = T(await page.locator('header').first().innerText({ timeout: 8000 }).catch(() => '')); return a || T(await page.locator('header').first().textContent({ timeout: 8000 }).catch(() => '')); };
// Location trap (F4, 29 Oct): assert the header shows the intended location at the start AND the end of every run.
const ver = async () => { meta.appVersion = await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
  if (meta.header_start === undefined) { meta.header_start = (await hdr()).slice(0, 300); meta.location_ok_start = meta.header_start.includes(M.loc); } };
const search = async term => { const inp = page.locator('.q-page input[placeholder*="Search" i]').filter({ visible: true });
  if (!(await inp.count())) { await page.locator('.q-page button').filter({ hasText: 'Search' }).first().click().catch(e => meta.searchErr = e.message.split('\n')[0]); await page.waitForTimeout(1200); }
  const i2 = page.locator('.q-page input').filter({ visible: true }); const foc = await page.evaluate(() => document.activeElement && document.activeElement.tagName);
  if (foc === 'INPUT') await page.keyboard.type(term); else await i2.first().fill(term); await page.waitForTimeout(8000); };
const pickPreset = async label => { await chips().filter({ hasText: /Date:/ }).first().click(); await page.waitForTimeout(1500);
  meta.dateMenu = (await menu().innerText().catch(() => '')).split('\n').map(T).filter(Boolean);
  await menu().getByText(label, { exact: true }).first().click(); await page.waitForTimeout(800);
  const ap = menu().getByText(/^Apply$/); if (await ap.count()) await ap.first().click().catch(() => {});
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(8000); };
const allLocations = async () => { await chips().filter({ hasText: /Location/ }).first().click(); await page.waitForTimeout(1500);
  meta.locMenu = (await menu().innerText().catch(() => '')).split('\n').map(T).filter(Boolean);
  const it = menu().getByText(/^(Select all|All locations)$/).first(); meta.allLocItem = await it.count(); if (await it.count()) await it.click();
  await page.waitForTimeout(800); meta.locMenuAfter = (await menu().innerText().catch(() => '')).split('\n').map(T).filter(Boolean); await page.keyboard.press('Escape').catch(() => {}); await page.mouse.click(5, 700); await page.waitForTimeout(9000); };
const colMenu = async (toggle = []) => { const btn = page.locator('[data-test-id*="column"], button[aria-label*="olumn"]').first(); await btn.click().catch(e => meta.colErr = e.message.split('\n')[0]); await page.waitForTimeout(1500);
  const items = menu().locator('.q-item'); const n = await items.count(); const st = [];
  for (let i = 0; i < n; i++) { const it = items.nth(i); const sw = it.locator('[role="switch"], [role="checkbox"]').first(); st.push([T(await it.innerText()), (await sw.count()) ? await sw.getAttribute('aria-checked') : null]); }
  for (const w of toggle) { const it = items.filter({ hasText: new RegExp('^\\s*' + w + '\\s*$') }).first(); if (await it.count()) { await it.locator('[role="switch"], [role="checkbox"]').first().click(); await page.waitForTimeout(1200); } else meta['colMissing_' + w] = true; }
  await page.screenshot({ path: `${OUT}/colmenu-${toggle.join('_') || 'look'}.png` });
  await page.keyboard.press('Escape').catch(() => {}); await page.mouse.click(5, 700); await page.waitForTimeout(5000); return st; };
const download = async (kind, tag) => { const more = page.locator('.q-page button').filter({ hasText: 'more_horiz' }).first();
  await more.click().catch(e => meta['moreErr' + tag] = e.message.split('\n')[0]); await page.waitForTimeout(1500);
  const it = menu().getByText(new RegExp('Download \\(' + kind + '\\)')).first(); let res = null;
  if (await it.count()) { const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 120000 }).catch(e => { meta['dlErr' + tag] = e.message.split('\n')[0]; return null; }), it.click()]);
    if (dl) { const p = `${OUT}/${tag}.${kind.toLowerCase()}`; await dl.saveAs(p); res = { file: p, name: dl.suggestedFilename() }; if (kind === 'CSV') res.head = fs.readFileSync(p, 'utf8').split('\n').slice(0, 6); } }
  else meta['dlMissing' + tag] = (await menu().innerText().catch(() => '')).slice(0, 200);
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(1200); return res; };
const PV = '[data-test-id="table_parts_velocity"]';
const openPV = async () => { await page.goto(APP + '/reports/parts-velocity', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForSelector(PV, { timeout: 90000 }); await page.waitForTimeout(12000); await ver(); };
const openIV = async () => { await page.goto(APP + '/reports/inventory-value', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForSelector('table thead th', { timeout: 90000 }); await page.waitForTimeout(12000); await ver(); };
const ZZ = ['ZZAUTOTEST-PV1-10282011', 'ZZAUTOTEST-SO1-10282011', 'ZZAUTOTEST-SO2-10282011'];
const guard = async (name, fn) => { try { await fn(); } catch (e) { meta['err_' + name] = e.message.split('\n')[0]; save(); } };

if (mode === 'PV_DVI') {
  await openPV();
  await step('ii_fresh_default', PV, ZZ);
  await guard('cols', async () => { meta.colMenuFresh = await colMenu(); });
  await guard('dl_default', async () => { meta.dl_default_csv = await download('CSV', 'pv-default'); meta.dl_default_pdf = await download('PDF', 'pv-default'); });
  await guard('i', async () => { await search('ZZAUTOTEST'); await step('i_ticket_filters_search_ZZAUTOTEST', PV, ZZ); });
  await guard('iii_loc', async () => { await allLocations(); await step('iii_a_all_locations_search', PV, ZZ); });
  await guard('iii_date', async () => { await pickPreset('Last 12 months'); await step('iii_b_all_locations_last12m_search', PV, ZZ); });
  await guard('dl_wide', async () => { meta.dl_wide_csv = await download('CSV', 'pv-last12m'); });
  // remembered settings: reload (same tab) and a fresh navigation from the left menu
  await guard('reload', async () => { await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForSelector(PV, { timeout: 90000 }); await page.waitForTimeout(12000); await step('r1_after_reload', PV, ZZ); });
  await guard('renav', async () => { await page.goto(APP + '/reports', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(5000); await openPV(); await step('r2_new_entry_after_picks', PV, ZZ); });
}
if (mode === 'PV_HD') {
  await openPV();
  await step('ii_fresh_default', PV, [], false);
  await guard('ii_s', async () => { await search('N000000001069'); await step('ii_fresh_default_search', PV, ['N000000001069']); });
  await guard('i', async () => { await pickPreset('Last quarter'); await step('i_ticket_filters_last_quarter_search', PV, ['N000000001069']); });
  await guard('iii_loc', async () => { await allLocations(); await step('iii_a_all_locations_last_quarter', PV, ['N000000001069']); });
  await guard('iii_date', async () => { await pickPreset('Last 12 months'); await step('iii_b_all_locations_last12m', PV, ['N000000001069']); });
}
if (mode === 'IV_DVI') {
  await openIV();
  await step('ii_fresh_default', 'table', ['ZZAUTOTEST-PV1-10282011']);
  await guard('cols', async () => { meta.colMenuFresh = await colMenu(); });
  await guard('dl_default', async () => { meta.dl_default_csv = await download('CSV', 'iv-default'); meta.dl_default_pdf = await download('PDF', 'iv-default'); });
  await guard('iii_loc', async () => { await allLocations(); await step('iii_all_locations', 'table', ['ZZAUTOTEST-PV1-10282011']); meta.dl_all_csv = await download('CSV', 'iv-all-locations'); });
  // remembered column set: switch Margin off, then enter the page again
  await guard('remember', async () => { meta.colMenuToggle = await colMenu(['Margin']); await page.goto(APP + '/reports', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(4000); await openIV(); await step('r_new_entry_after_margin_off', 'table', []); });
}
if (mode === 'RET_LIST') {
  await page.goto(APP + '/parts/returns', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(12000); await ver();
  const row = page.locator('tbody tr').filter({ hasText: 'ZZAUTOTEST' });
  meta.zzRows = (await row.allInnerTexts()).map(T); await step('list', null, [], true);
}
if (mode === 'RET_CREATE') { // Parts -> Returns -> Create Return (SV-11941 steps 3-9), slip text = arg
  const slip = arg ? arg.replace(/_/g, ' ') : 'ZZAUTOTEST cancel check';
  await page.goto(APP + '/parts/returns', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000); await ver();
  await page.locator('main button').filter({ hasText: 'Create Return' }).first().click(); await page.waitForTimeout(6000);
  const v = page.locator('[data-test-id="select_vendor"]').first();
  await v.click(); await page.waitForTimeout(800); await page.keyboard.type('123 Cannabis'); await page.waitForTimeout(3000);
  await menu().getByText('123 Cannabis Forestlawn').first().click(); await page.waitForTimeout(1500);
  await page.locator('input[aria-label="Packaging Slip"]').first().fill(slip);
  const ps = page.locator('[data-test-id="create_return_part_select"]').first();
  await ps.click().catch(() => {}); await page.waitForTimeout(600); await page.keyboard.type('ZZAUTOTEST-PV1-10282011'); await page.waitForTimeout(5000);
  meta.partMenu = (await menu().innerText().catch(() => '')).split('\n').map(T).filter(Boolean).slice(0, 10);
  await menu().locator('.q-item').filter({ hasText: 'ZZAUTOTEST-PV1-10282011' }).first().click(); await page.waitForTimeout(4000);
  const q = page.locator('[data-test-id^="input_return_qty_0_"] input, input[data-test-id^="input_return_qty_0_"]').first();
  if (await q.count()) await q.fill('1'); else await page.locator('[data-test-id="table_create_return"] input[type="number"]').first().fill('1');
  await page.waitForTimeout(1500);
  meta.rowText = await txt(page.locator('[data-test-id="table_create_return"] tbody'));
  await page.screenshot({ path: `${OUT}/1-filled.png` });
  await page.locator('button').filter({ hasText: 'Save Return' }).first().click(); await page.waitForTimeout(9000);
  meta.afterSaveUrl = page.url(); meta.afterSave = (await txt(page.locator('main'))).slice(0, 1500);
  await page.goto(APP + '/parts/returns', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
  meta.zzRows = (await page.locator('tbody tr').filter({ hasText: slip }).allInnerTexts()).map(T);
  await step('2-returns-list-after-save', null, [], true);
}
if (mode === 'RET_PV') { // Units Returned switched on (SV-11941 steps 10-13), then widened
  await openPV();
  await guard('cols', async () => { meta.colMenuToggle = await colMenu(['Units Returned']); });
  await guard('i', async () => { await search('ZZAUTOTEST-PV1'); await step('i_ticket_filters', PV, ['ZZAUTOTEST-PV1-10282011']); });
  await guard('iii_loc', async () => { await allLocations(); await step('iii_a_all_locations', PV, ['ZZAUTOTEST-PV1-10282011']); });
  await guard('iii_date', async () => { await pickPreset('Last 12 months'); await step('iii_b_all_locations_last12m', PV, ['ZZAUTOTEST-PV1-10282011']); });
  await guard('ii', async () => { await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (/^report_(range|table):parts-velocity/.test(k)) localStorage.removeItem(k); });
    await page.goto(APP + '/reports', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(3000); await openPV(); await colMenu(['Units Returned']); await step('ii_defaults_no_search_units_returned_on', PV, ['ZZAUTOTEST-PV1-10282011']); });
}
if (/^RET_/.test(mode)) { meta.console = []; page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') meta.console.push(m.type() + ': ' + m.text().slice(0, 400)); });
  page.on('pageerror', e => meta.console.push('pageerror: ' + (e.message || '').slice(0, 400)));
  meta.returnLists = []; page.on('response', async r => { if (r.request().method() === 'GET' && /\/api\/.*return/i.test(r.url())) { const b = await r.text().catch(() => '');
    const ids = [...b.matchAll(/"id":"([0-9a-f-]{36})"[^{}]{0,1500}?ZZAUTOTEST cancel check/g)].map(x => x[1]); meta.returnLists.push([r.url().replace(/^.*?\/api\//, '').slice(0, 200), r.status(), b.length, ids]); } }); }
if (mode === 'RET_CANCEL') { // SV-11941 step 14: Parts -> Returns -> (row) more_vert -> Cancel Return -> Yes ; then reload and look again
  const slip = arg ? arg.replace(/_/g, ' ') : 'ZZAUTOTEST cancel check';
  await page.goto(APP + '/parts/returns', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000); await ver();
  const row = () => page.locator('tbody tr').filter({ hasText: slip });
  meta.rowsBefore = (await row().allInnerTexts()).map(T); meta.rowBox = await box(row());
  await row().first().locator('button').last().click(); await page.waitForTimeout(1500);
  meta.rowMenu = (await menu().innerText().catch(() => '')).split('\n').map(T).filter(Boolean);
  await page.screenshot({ path: `${OUT}/1-row-menu.png` });
  await menu().getByText(/Cancel Return/).first().click(); await page.waitForTimeout(2000);
  meta.dialog = (await page.locator('.q-dialog').last().innerText().catch(() => '')).split('\n').map(T).filter(Boolean);
  await page.screenshot({ path: `${OUT}/2-cancel-dialog.png` });
  const nw = meta.writes.length;
  await page.locator('.q-dialog').last().getByRole('button', { name: 'Yes', exact: true }).click().catch(e => meta.confErr = e.message.split('\n')[0]);
  await page.waitForTimeout(1500);
  meta.notifyAfterYes = (await page.locator('.q-notification').allInnerTexts().catch(() => [])).map(T);
  meta.dialogsAfterYes = (await page.locator('.q-dialog').allInnerTexts().catch(() => [])).map(s => T(s).slice(0, 300));
  await page.waitForTimeout(5000);
  meta.writesAfterYes = meta.writes.slice(nw);
  meta.rowsAfterYes = (await row().allInnerTexts()).map(T); meta.rowBoxAfter = await box(row());
  await page.screenshot({ path: `${OUT}/3-after-yes.png` });
  // The Yes button turns into a second confirm, "Are You Sure?" (seen 29 Oct 09:30 UTC). Record its state, then click it.
  const sure = page.locator('.q-dialog').last().getByRole('button', { name: /Are You Sure/i });
  meta.sureCount = await sure.count();
  if (meta.sureCount) { meta.sureDisabled = await sure.first().isDisabled().catch(() => null); meta.sureBox = await box(sure);
    const nw2 = meta.writes.length; const t0 = Date.now();
    await sure.first().click({ timeout: 15000 }).catch(e => meta.sureErr = e.message.split('\n')[0]); meta.sureClickMs = Date.now() - t0;
    await page.waitForTimeout(1500); meta.notifyAfterSure = (await page.locator('.q-notification').allInnerTexts().catch(() => [])).map(T);
    await page.screenshot({ path: `${OUT}/3b-after-are-you-sure.png` });
    await page.waitForTimeout(5000); meta.writesAfterSure = meta.writes.slice(nw2); meta.dialogsAfterSure = (await page.locator('.q-dialog').allInnerTexts().catch(() => [])).map(s => T(s).slice(0, 200));
    meta.rowsAfterSure = (await row().allInnerTexts()).map(T); }
  await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(12000);
  meta.rowsAfterReload = (await row().allInnerTexts()).map(T); meta.rowBoxReload = await box(row());
  await page.screenshot({ path: `${OUT}/4-after-reload.png` });
}
// AMENDMENT 1 (QA lead 29 Oct): every filter that is not the subject is deselected (All locations, widest date preset,
// no search). The row is then found by sorting Part # (a sort hides nothing), never by the search box.
const firstPart = async sel => T(await page.locator(`${sel} tbody tr`).first().locator('td').nth(1).innerText().catch(() => ''));
const sortPartDesc = async sel => { const th = page.locator(`${sel} thead th`).filter({ hasText: /Part #/ }).first();
  for (let k = 0; k < 3; k++) { await th.click().catch(e => meta.sortErr = e.message.split('\n')[0]); await page.waitForTimeout(9000);
    const last = meta.api.filter(a => /reports\/parts-velocity\?/.test(a)).pop() || ''; meta['sortTry' + k] = (last.match(/sortBy\]=[^&]+&pagination\[descending\]=\w+/) || [''])[0];
    if (/sortBy\]=part_number&pagination\[descending\]=true/.test(last)) return true; } return false; };
// bring a row on screen WITHOUT the search box: keep scrolling the (infinite-scroll) table until the row is loaded
const scrollToRow = async (sel, text) => { for (let k = 0; k < 25; k++) { const r = page.locator(`${sel} tbody tr`).filter({ hasText: text });
    if (await r.count()) { await r.first().scrollIntoViewIfNeeded(); await page.waitForTimeout(1500); meta['scrollRounds_' + text] = k; return true; }
    await page.locator(`${sel} tbody tr`).filter({ hasText: /Inventory|Special Order/ }).last().scrollIntoViewIfNeeded().catch(() => {}); await page.mouse.wheel(0, 3000); await page.waitForTimeout(3500); } return false; };
if (mode === 'PV_DVI_DESEL') {
  await openPV();
  await step('d0_fresh', PV, [], false);
  // B1: the date option IS the subject (stays Last 90 days); Location is not -> All locations
  await guard('b1', async () => { await allLocations(); await step('b1_all_locations_last90', PV, [], true);
    meta.b1_csv = await download('CSV', 'b1-all-locations-last90'); meta.b1_pdf = await download('PDF', 'b1-all-locations-last90'); });
  // B6 / B7 (and B2 base): date widest preset, all locations, no search, Part # sorted descending
  await guard('b67', async () => { await pickPreset('Last 12 months'); meta.sortFound = await sortPartDesc(PV); await step('b67_all_locations_last12m_sorted_no_search', PV, ZZ, true); });
}
if (mode === 'PV_DVI_B3') { // B3: the one-location pick IS the subject; the date is not -> widest preset
  await openPV();
  await guard('b3', async () => { await pickPreset('Last 12 months'); await step('b3_dvi_only_last12m', PV, [], true); meta.colMenuB3 = await colMenu(); });
  await guard('b3w', async () => { await allLocations(); await step('b3_all_locations_last12m', PV, [], true); meta.colMenuB3all = await colMenu(); });
}
if (mode === 'RET_PV_DESEL') { // B2 deselected: Units Returned on, all locations, Last 12 months, no search, Part # desc
  await openPV();
  await guard('cols', async () => { meta.colMenuToggle = await colMenu(['Units Returned']); });
  await guard('d', async () => { await allLocations(); await pickPreset('Last 12 months'); meta.sortFound = await sortPartDesc(PV); meta.rowFound = await scrollToRow(PV, 'ZZAUTOTEST-PV1-10282011'); await step('b2_deselected_' + (arg || 'x'), PV, ['ZZAUTOTEST-PV1-10282011'], true); });
  await guard('i', async () => { await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (/^report_(range|table):parts-velocity/.test(k)) localStorage.removeItem(k); });
    await page.goto(APP + '/reports', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(3000); await openPV(); await colMenu(['Units Returned']); await search('ZZAUTOTEST-PV1'); await step('b2_ticket_filters_' + (arg || 'x'), PV, ['ZZAUTOTEST-PV1-10282011'], true); });
}
if (mode === 'IV_DVI_DESEL') { // B5 / B8 with every non-subject filter deselected: all locations, As of = today (its default)
  await openIV();
  await guard('d', async () => { await allLocations(); await step('iv_all_locations_asof_today', 'table', ['ZZAUTOTEST-PV1-10282011'], true);
    meta.colMenuAll = await colMenu(); meta.dl_all_csv = await download('CSV', 'iv-all-locations'); meta.dl_all_pdf = await download('PDF', 'iv-all-locations'); });
}
if (mode === 'PV_HD_DESEL') { // B4: all locations, widest preset; the search box is used ONLY to bring the one row on screen
  await openPV();
  await guard('d', async () => { await allLocations(); await pickPreset('Last 12 months'); await step('b4_all_locations_last12m_no_search', PV, ['N000000001069'], false);
    await search('N000000001069'); await step('b4_all_locations_last12m_search_finder', PV, ['N000000001069'], true); });
}
if (mode === 'PV_DVI_B67') { // B6 / B7 deselected only (wide viewport for the picture): all locations, Last 12 months, no search, Part # descending
  await openPV();
  await guard('b67', async () => { await allLocations(); await pickPreset('Last 12 months'); meta.sortFound = await sortPartDesc(PV); meta.rowFound = await scrollToRow(PV, 'ZZAUTOTEST-SO1-10282011'); await page.evaluate(() => window.scrollBy(0, 200)); await step('b67_all_locations_last12m_sorted_no_search', PV, ZZ, true); });
}
meta.header_end = (await hdr()).slice(0, 300); meta.location_ok_end = meta.header_end.includes(M.loc);
meta.VALID = !!(meta.location_ok_start && meta.location_ok_end);
if (mode === 'IV_DVI_PIC') { // B5 / B8 picture only: first visit (fresh browser), Location -> Select all, As of = today (default); wide viewport
  await openIV();
  await guard('d', async () => { await allLocations(); await step('iv_first_visit_all_locations', 'table', [], true); });
}
if (mode === 'OBSA_IV_PDF') { // OBS A: fresh first visit; Location -> Select all (arg 'all') or keep the active location (arg 'one'); Download (PDF)
  meta.exportResp = []; page.on('response', async r => { if (/inventory-value\/export/.test(r.url())) meta.exportResp.push({ status: r.status(), url: decodeURIComponent(r.url().replace(/^.*?\/api\//, '')).slice(0, 400), at: new Date().toISOString(), body: r.status() >= 400 ? (await r.text().catch(() => '')).slice(0, 300) : '' }); });
  meta.notes = []; const pollNotes = async ms => { const t0 = Date.now(); while (Date.now() - t0 < ms) { for (const n of (await page.locator('.q-notification').allInnerTexts().catch(() => [])).map(T)) if (!meta.notes.includes(n)) meta.notes.push(n); if (meta.exportResp.length && meta.notes.length) break; await page.waitForTimeout(1000); } };
  await openIV();
  if (arg !== 'one') await allLocations();
  await step('before_download', 'table', [], true);
  const more = page.locator('.q-page button').filter({ hasText: 'more_horiz' }).first();
  await more.click(); await page.waitForTimeout(1500);
  const it = menu().getByText(/Download \(PDF\)/).first(); meta.clickAt = new Date().toISOString();
  const dlP = page.waitForEvent('download', { timeout: 240000 }).catch(e => { meta.dlErr = e.message.split('\n')[0]; return null; });
  await it.click(); await page.waitForTimeout(800); await page.screenshot({ path: `${OUT}/during.png` });
  const pn = pollNotes(240000); const dl = await Promise.race([dlP, (async () => { await pn; return 'notes'; })()]);
  if (dl && dl !== 'notes') { meta.download = { name: dl.suggestedFilename() }; await dl.saveAs(`${OUT}/iv.pdf`); }
  await pollNotes(4000); meta.doneAt = new Date().toISOString();
  await page.screenshot({ path: `${OUT}/after.png` }); await step('after_download', 'table', [], false);
}
if (mode === 'OBSB_PV_FIND') { // OBS B: Last Sale for one part; Last 12 months, all locations, search only as a finder. arg = part number
  await openPV();
  await guard('d', async () => { await allLocations(); await pickPreset('Last 12 months'); await search(arg); meta.readAt = new Date().toISOString(); await step('lastsale_' + arg.replace(/[^A-Za-z0-9-]/g, ''), PV, [arg], true); });
}
save(); await browser.close();
fs.mkdirSync(`${EV}/screen`, { recursive: true });
fs.writeFileSync(`${EV}/screen/${mode}${arg ? '_' + arg : ''}_${meta.observed_at_utc.replace(/[:.]/g, '')}.json`, JSON.stringify(meta, null, 1));
console.log(JSON.stringify({ mode, appVersion: meta.appVersion, zones: [meta.browser_zone, meta.process_zone, meta.app_timezone_key, meta.location_tz], errs: Object.keys(meta).filter(k => k.startsWith('err_')), VALID: meta.VALID, hs: meta.header_start && meta.header_start.slice(-60), he: meta.header_end && meta.header_end.slice(-60) }));
