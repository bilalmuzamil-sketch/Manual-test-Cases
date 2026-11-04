// seeded_hd.mjs — SV-11931 and SV-11934 on the seeded ZZAUTOTEST work orders at Staging Heavy Duty - 9919. TZ=America/Edmonton. SECRET-FREE.
// Seeds: tools/seed_qa.py (ids in /tmp/cln/qa11839/seed.json). Phases: te | sbc-before | sbc-edit | sbc-after
import fs from 'fs';
import { boot, finish, shot, save, sleep, LOC, APP, OUT } from './common.mjs';
const loc = LOC.HD; const S = JSON.parse(fs.readFileSync('/tmp/cln/qa11839/seed.json', 'utf8'));
const phase = process.argv[2];
const { browser, page, rule99, app_version } = await boot(loc);
const T = phase === 'te' ? 'SV-11931' : 'SV-11934';
const evF = `${OUT}/${T}/evidence.json`; const EV = fs.existsSync(evF) ? JSON.parse(fs.readFileSync(evF, 'utf8')) : { ticket: T, app_version, location: loc.name, phases: {} };
EV.phases ||= {}; const P = EV.phases[phase] = { rule99_start: rule99, app_version, started_utc: new Date().toISOString() };
const txt = async l => (await l.first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
const box = async l => { const b = await l.first().boundingBox().catch(() => null); return b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) }; };
const goDash = async () => { await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForSelector('[data-test-id="hero_value_revenueKpi"]', { timeout: 90000 }); await sleep(6000); };
const popup = () => page.locator('.date-range-popup').last();
const setPreset = async (k, re) => { await page.locator(`[data-test-id="date-range-selector_hero_range_${k}_trigger"]`).click(); await sleep(900); await popup().locator('.preset-option').filter({ hasText: re }).first().click(); await sleep(500); if (await popup().isVisible().catch(() => false)) await popup().getByRole('button', { name: 'Apply' }).click().catch(() => {}); await sleep(6000); };
const M = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const toNov2026 = async () => { for (let i = 0; i < 30; i++) { const t = (await popup().locator('.q-date__navigation').innerText()).replace(/\s+/g, ' ');
  const cur = +(t.match(/\b(20\d\d)\b/)[1]) * 12 + M.indexOf(M.find(x => t.includes(x))); const want = 2026 * 12 + 10; if (cur === want) return;
  await popup().locator('.q-date__navigation .q-date__arrow button').nth(cur > want ? 0 : 1).click(); await sleep(300); } };
const setToday = async k => { await page.locator(`[data-test-id="date-range-selector_hero_range_${k}_trigger"]`).click(); await sleep(900); await toNov2026();
  const d = popup().locator('.q-date__calendar-item--in button').filter({ hasText: /^4$/ }).first(); await d.click(); await sleep(400); await d.click(); await sleep(400);
  P[`picker_${k}`] = await txt(popup().locator('.selected-range')); await popup().getByRole('button', { name: 'Apply' }).click(); await sleep(6000); };
async function panelRow(k, name, label) {
  await page.locator(`[data-test-id="btn_toggle_details_${k}"]`).click(); await sleep(7000);
  const panel = page.locator('[data-test-id="hero_detail_panel"]').first();
  const heads = await panel.locator('thead th').allInnerTexts().catch(() => []);
  const row = panel.locator('tr').filter({ hasText: name }).first(); await row.scrollIntoViewIfNeeded().catch(() => {}); await sleep(800);
  const r = { range: await txt(page.locator(`[data-test-id="date-range-selector_hero_range_${k}_trigger"]`)), tile_value: await txt(page.locator(`[data-test-id="hero_value_${k}"]`)), tile_meta: await txt(page.locator(`[data-test-id="hero_meta_${k}"]`)),
    heads: heads.map(h => h.replace(/\s+/g, ' ').trim()), row_text: await txt(row), row_cells: await row.locator('td').allInnerTexts().catch(() => []), row_box: await box(row), all_rows: (await panel.locator('tbody tr').allInnerTexts().catch(() => [])).map(x => x.replace(/\s+/g, ' ')).slice(0, 40) };
  r.picture = await shot(page, T, label); await page.locator(`[data-test-id="btn_toggle_details_${k}"]`).click().catch(() => {}); await sleep(1200); return r;
}
async function woTab(wo, tab, label) {
  await page.goto(`${APP}/workorders/${wo}/lines`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(9000);
  if (tab !== 'Lines') { await page.getByText(tab, { exact: true }).first().click(); await sleep(7000); }
  return { url: page.url().replace(APP, ''), main: (await txt(page.locator('main'))).slice(0, 1800), picture: await shot(page, T, label) };
}
if (phase === 'te') {
  const name = 'Stephen Grimes';
  await goDash(); P.tile_this_month = { value: await txt(page.locator('[data-test-id="hero_value_techEfficiencyKpi"]')), meta: await txt(page.locator('[data-test-id="hero_meta_techEfficiencyKpi"]')) };
  await setToday('techEfficiencyKpi'); P.today = await panelRow('techEfficiencyKpi', name, '1-dashboard-te-today-stephen-grimes');
  await goDash(); await setPreset('techEfficiencyKpi', /last 12 months/i); P.last12 = await panelRow('techEfficiencyKpi', name, '2-dashboard-te-last-12-months-stephen-grimes');
  P.wo_lines = await woTab(S.TE.wo, 'Lines', '3-work-order-lines'); P.wo_finance = await woTab(S.TE.wo, 'Finance', '4-work-order-finance');
  await page.goto(`${APP}/reports/technician-efficiency?range=custom&range=2026-11-04&range=2026-11-04`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(12000);
  P.report = { url: page.url().replace(APP, ''), chips: (await page.locator('main').innerText()).split('\n').filter(l => /Date|Invoiced|Completed|View/i.test(l)).slice(0, 6), row: await txt(page.locator('tr').filter({ hasText: name })), heads: (await page.locator('thead th').allInnerTexts().catch(() => [])).map(h => h.replace(/\s+/g, ' ').trim()), picture: await shot(page, T, '5-report-technician-efficiency-today') };
}
const SBCNAME = S.SBC.name;
if (phase === 'sbc-before' || phase === 'sbc-after') {
  // Last 12 Months (the ticket's step) lists only the top 15 customers by subtotal at Heavy Duty, so the $182 test customer cannot appear there;
  // the faithful equivalent narrows the same tile to today (Nov 4), when the seeded invoices are the only ones.
  await goDash(); P.dashboard_last12 = await panelRow('salesByCustomer', SBCNAME, `${phase === 'sbc-before' ? '1a' : '6a'}-dashboard-sbc-last-12-months-${phase}`);
  await goDash(); await setToday('salesByCustomer'); P.dashboard = await panelRow('salesByCustomer', SBCNAME, `${phase === 'sbc-before' ? '1' : '6'}-dashboard-sbc-today-${phase}`);
  P.stats = await woTab(S.SBC.wo, 'Stats', `${phase === 'sbc-before' ? '2' : '5'}-work-order-stats-${phase}`);
}
if (phase === 'sbc-edit') {
  await page.goto(APP + '/reports/punch-clock-activities', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(11000);
  const disp = S.SBC.display; const row = page.locator('tr').filter({ hasText: disp }).first();
  P.list_date_chip = await txt(page.locator('[data-test-id="filter_chip_range"]'));
  await row.scrollIntoViewIfNeeded().catch(() => {}); await row.hover().catch(() => {}); await sleep(600);
  P.row_before = await txt(row); P.pic_row_before = await shot(page, T, '3-timesheet-row-before');
  await row.locator('[data-test-id*="edit_timesheet"]').first().click(); await sleep(4000);
  const dlg = page.locator('.q-dialog').last();
  const start = dlg.locator('[data-test-id*="input_timesheet_start_date"] input, input[data-test-id*="input_timesheet_start_date"]').first();
  P.dialog_before = (await dlg.innerText()).replace(/\n+/g, ' | ').slice(0, 600); P.start_before = await start.inputValue().catch(() => null);
  const m = (P.start_before || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) throw new Error('cannot parse start ' + P.start_before);
  let mins = ((+m[1] % 12) + (/pm/i.test(m[3]) ? 12 : 0)) * 60 + +m[2] - 30; const h24 = Math.floor(mins / 60), mm = String(mins % 60).padStart(2, '0');
  const h12 = ((h24 + 11) % 12) + 1, ap = h24 >= 12 ? 'PM' : 'AM';
  const want = P.start_before.replace(m[0], `${String(h12).padStart(m[1].length, '0')}:${mm} ${ap}`);
  await start.click(); await start.fill(''); await start.type(want, { delay: 40 }); await page.keyboard.press('Tab'); await sleep(1200);
  P.start_after = await start.inputValue().catch(() => null); P.dialog_after = (await dlg.innerText()).replace(/\n+/g, ' | ').slice(0, 600);
  P.pic_dialog = await shot(page, T, '4-edit-timesheet-dialog');
  const posts = []; page.on('response', async r => { if (r.request().method() !== 'GET' && r.url().includes('technician-tasks')) posts.push(`${r.status()} ${r.request().method()} ${r.url().replace(/^.*\/api/, '/api')}`); });
  await dlg.locator('[data-test-id="button_save_timesheet"]').click(); await sleep(6000);
  P.after_save_dialog = await page.locator('.q-dialog').count() ? (await page.locator('.q-dialog').last().innerText().catch(() => '')).replace(/\n+/g, ' | ').slice(0, 400) : null;
  P.posts = posts; const row2 = page.locator('tr').filter({ hasText: disp }).first(); P.row_after = await txt(row2); P.pic_row_after = await shot(page, T, '4b-timesheet-row-after');
}
P.rule99_end = await finish(page, loc, rule99); P.ended_utc = new Date().toISOString();
fs.mkdirSync(`${OUT}/${T}`, { recursive: true }); fs.writeFileSync(evF, JSON.stringify(EV, null, 1));
const brief = JSON.parse(JSON.stringify(P)); for (const k of Object.keys(brief)) if (/rule99/.test(k)) brief[k] = brief[k].all_match;
console.log(phase, JSON.stringify(brief, (k, v) => (k === 'main' || k === 'all_rows' ? undefined : v)).slice(0, 3000));
await browser.close();
