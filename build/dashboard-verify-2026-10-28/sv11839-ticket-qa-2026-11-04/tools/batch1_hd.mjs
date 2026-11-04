// batch1_hd.mjs — SV-11821, SV-11824, SV-11825, SV-11826, SV-11827 on the Dashboard at Staging Heavy Duty - 9919.
// Run with TZ=America/Edmonton. SECRET-FREE. Pictures at deviceScaleFactor 2.
import { boot, finish, shot, save, sleep, LOC, APP } from './common.mjs';
const loc = LOC.HD;
const only = process.argv[2] ? process.argv[2].split(',') : null;
const want = t => !only || only.includes(t);
const { browser, page, rule99, app_version } = await boot(loc);
const api = [];
page.on('response', async r => { const u = r.url(); if (u.includes('/api/dashboard/reports') || u.includes('/api/report')) { try { api.push({ url: decodeURIComponent(u).replace(/^.*\/api/, '/api'), status: r.status(), body: await r.json() }); } catch { api.push({ url: u, status: r.status() }); } } });
const goDash = async () => { await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForSelector('[data-test-id="hero_value_revenueKpi"]', { timeout: 90000 }); await sleep(6000); };
const trig = k => page.locator(`[data-test-id="date-range-selector_hero_range_${k}_trigger"]`);
const popup = () => page.locator('.date-range-popup').last();
const popState = async () => ({ header: (await popup().locator('.selected-range').innerText().catch(() => null)), range: (await popup().locator('[data-test-id$="_range_indicator"]').innerText().catch(() => null)) });
const monthLabel = async () => (await popup().locator('.q-date__navigation').innerText().catch(() => '')).replace(/\s+/g, ' ');
async function gotoMonth(target /* 'October 2026' */) {
  for (let i = 0; i < 24; i++) {
    const m = await monthLabel(); if (m.includes(target.split(' ')[0]) && m.includes(target.split(' ')[1])) return m;
    await popup().locator('.q-date__arrow button').first().click(); await sleep(350);
  }
  throw new Error('month not reached ' + target + ' / ' + (await monthLabel()));
}
const day = n => popup().locator('.q-date__calendar-item--in button').filter({ hasText: new RegExp(`^${n}$`) }).first();
const apply = async () => { await popup().getByRole('button', { name: 'Apply' }).click(); await sleep(4500); };
async function setCustom(k, month, d1, d2) {
  await trig(k).click(); await sleep(900); await gotoMonth(month);
  await day(d1).click(); await sleep(500); const afterFirst = await popState();
  await day(d2).click(); await sleep(500); const afterSecond = await popState();
  return { afterFirst, afterSecond };
}
const E = { app_version, rule99, observed_start_utc: new Date().toISOString(), tickets: {} };
await goDash();

// ---------- SV-11825: accessible names of the five tile report links ----------
if (want('SV-11825')) {
  const keys = ['revenueKpi', 'billingEfficiencyKpi', 'techEfficiencyKpi', 'techUtilizationKpi', 'salesByCustomer'];
  const rows = [];
  for (const k of keys) {
    const l = page.locator(`[data-test-id="link_report_${k}"]`).first();
    const aria = await l.getAttribute('aria-label').catch(() => null);
    const accName = await l.evaluate(el => el.getAttribute('aria-label') || el.getAttribute('title') || el.innerText).catch(() => null);
    const label = await page.locator(`[data-test-id="hero_label_${k}"]`).innerText().catch(() => null);
    await l.hover().catch(() => {}); await sleep(900);
    const tip = await page.locator('.q-tooltip').last().innerText().catch(() => null);
    rows.push({ key: k, tile_label: label?.replace(/\n/g, ' '), aria_label: aria, accessible_name_source: accName, hover_tooltip: tip });
  }
  const snap = await page.locator('[data-test-id^="link_report_"]').evaluateAll(els => els.map(e => ({ id: e.getAttribute('data-test-id'), aria: e.getAttribute('aria-label'), role: e.getAttribute('role'), tag: e.tagName })));
  await page.locator('[data-test-id="link_report_revenueKpi"]').first().hover(); await sleep(800);
  const pic = await shot(page, 'SV-11825', 'revenue-link-hover-tooltip', { clip: { x: 0, y: 0, width: 1600, height: 520 } });
  E.tickets['SV-11825'] = { rows, all_links: snap, pictures: [pic] };
  console.log('SV-11825', JSON.stringify(rows.map(r => [r.key, r.aria_label, r.hover_tooltip])));
}

// ---------- SV-11821: Revenue custom Oct 10 – Oct 10, 2026 (as written) + a single-invoice day ----------
if (want('SV-11821')) {
  const out = {};
  for (const [tag, month, d] of [['as_written_oct10', 'October 2026', 10], ['one_invoice_day_jun20', 'June 2026', 20]]) {
    await goDash();
    const n0 = api.length;
    const st = await setCustom('revenueKpi', month, d, d);
    const p1 = await shot(page, 'SV-11821', `${tag}-picker-before-apply`, { clip: { x: 0, y: 0, width: 1600, height: 700 } });
    await apply();
    const value = await page.locator('[data-test-id="hero_value_revenueKpi"]').innerText().catch(() => null);
    const meta = await page.locator('[data-test-id="hero_meta_revenueKpi"]').innerText().catch(() => null);
    const chip = await trig('revenueKpi').innerText().catch(() => null);
    const p2 = await shot(page, 'SV-11821', `${tag}-tile-after-apply`, { clip: { x: 0, y: 0, width: 1600, height: 520 } });
    const resp = api.slice(n0).filter(a => a.url.includes('revenueKpi')).map(a => ({ url: a.url, status: a.status, revenueKpi: a.body?.data?.revenueKpi, invoicesKpi: a.body?.data?.invoicesKpi }));
    out[tag] = { picker: st, tile_value: value, tile_supporting_line: meta, date_chip: chip, server: resp, pictures: [p1, p2] };
    console.log('SV-11821', tag, JSON.stringify({ st, value, meta, chip }));
  }
  E.tickets['SV-11821'] = out;
}

// ---------- SV-11824: first click selects the date (This Month open; and with a custom range set) ----------
if (want('SV-11824')) {
  const out = {};
  await goDash();
  await trig('revenueKpi').click(); await sleep(900);
  out.opened = { chip: await trig('revenueKpi').innerText().catch(() => null), month: await monthLabel(), ...(await popState()) };
  await day(2).click(); await sleep(600);                      // Nov 2 lies inside This Month (Nov 1–4)
  out.this_month_first_click_nov2 = await popState();
  out.pic1 = await shot(page, 'SV-11824', 'this-month-first-click-nov2', { clip: { x: 0, y: 0, width: 1600, height: 700 } });
  await gotoMonth('October 2026'); await day(9).click(); await sleep(600);
  out.then_click_oct9 = await popState();
  await page.keyboard.press('Escape'); await sleep(800);
  // as written: open on This Month, go to Oct, single click on Oct 9
  await goDash(); await trig('revenueKpi').click(); await sleep(900); await gotoMonth('October 2026');
  await day(9).click(); await sleep(600);
  out.as_written_first_click_oct9 = await popState();
  out.pic2 = await shot(page, 'SV-11824', 'as-written-first-click-oct9', { clip: { x: 0, y: 0, width: 1600, height: 700 } });
  await day(15).click(); await sleep(500); out.second_click_oct15 = await popState(); await apply();
  out.chip_after_apply = await trig('revenueKpi').innerText().catch(() => null);
  // custom range already set (Oct 9–15): reopen, click Oct 12 (inside the range) once
  await trig('revenueKpi').click(); await sleep(900);
  out.reopened = await popState();
  await gotoMonth('October 2026'); await day(12).click(); await sleep(600);
  out.custom_set_first_click_oct12 = await popState();
  out.pic3 = await shot(page, 'SV-11824', 'custom-range-set-first-click-oct12', { clip: { x: 0, y: 0, width: 1600, height: 700 } });
  await page.keyboard.press('Escape'); await sleep(600);
  E.tickets['SV-11824'] = out;
  console.log('SV-11824', JSON.stringify(out));
}

// ---------- SV-11827: custom Oct 9 – Oct 20 → report link → date control shows "Custom" ----------
if (want('SV-11827')) {
  const out = {};
  for (const k of ['techUtilizationKpi', 'salesByCustomer', 'revenueKpi', 'billingEfficiencyKpi', 'techEfficiencyKpi']) {
    await goDash();
    await setCustom(k, 'October 2026', 9, 20); await apply();
    const chip = await trig(k).innerText().catch(() => null);
    const link = page.locator(`[data-test-id="link_report_${k}"]`).first();
    const href = await link.getAttribute('href').catch(() => null);
    const [p2] = await Promise.all([page.context().waitForEvent('page', { timeout: 8000 }).catch(() => null), link.click()]);
    const t = p2 || page; await t.waitForLoadState('domcontentloaded').catch(() => {}); await sleep(9000);
    const dateCtl = await t.evaluate(() => [...document.querySelectorAll('[data-test-id*="date"], [class*="filter-chip"], [class*="chip"]')].map(e => e.innerText.replace(/\s+/g, ' ').trim()).filter(s => /date|custom|\d{2}\/\d{2}\/\d{4}/i.test(s)).slice(0, 6));
    const lines = (await t.locator('main').innerText().catch(() => '')).split('\n').filter(l => /Date|Custom|\d{2}\/\d{2}\/\d{4}/i.test(l)).slice(0, 6);
    const pic = await (async () => { const p = `SV-11827`; const name = `${k}-report-date-control`; const { shot: s } = await import('./common.mjs'); return s(t, p, name, { clip: { x: 0, y: 0, width: 1600, height: 420 } }); })();
    out[k] = { tile_chip: chip, href, landed: t.url(), date_control_candidates: dateCtl, date_lines: lines, picture: pic };
    console.log('SV-11827', k, JSON.stringify({ chip, landed: t.url().replace(APP, ''), dateCtl, lines }));
    if (p2) await p2.close();
  }
  E.tickets['SV-11827'] = out;
}

// ---------- SV-11826: Technician Utilization tile vs report Summary row, Last 12 Months ----------
if (want('SV-11826')) {
  await goDash();
  const k = 'techUtilizationKpi';
  await trig(k).click(); await sleep(900);
  await popup().locator('[data-test-id$="_preset_last_12_months"], .preset-option').filter({ hasText: /^Last 12 Months$/ }).first().click(); await sleep(800);
  if (await popup().count()) { await popup().getByRole('button', { name: 'Apply' }).click().catch(() => {}); }
  const n0 = api.length; await sleep(6000);
  const tile = { chip: await trig(k).innerText(), value: await page.locator(`[data-test-id="hero_value_${k}"]`).innerText(), meta: await page.locator(`[data-test-id="hero_meta_${k}"]`).innerText(), at_utc: new Date().toISOString() };
  const tilePic = await shot(page, 'SV-11826', 'tile-last-12-months', { clip: { x: 0, y: 0, width: 1600, height: 520 } });
  const tileApi = api.filter(a => a.url.includes('techUtilizationKpi')).slice(-1).map(a => ({ url: a.url, kpi: a.body?.data?.techUtilizationKpi }));
  const link = page.locator(`[data-test-id="link_report_${k}"]`).first();
  const n1 = api.length;
  const [p2] = await Promise.all([page.context().waitForEvent('page', { timeout: 8000 }).catch(() => null), link.click()]);
  const t = p2 || page;
  const repApi = [];
  t.on('response', async r => { const u = r.url(); if (/report|utiliz/i.test(u) && u.includes('/api/')) { try { repApi.push({ url: decodeURIComponent(u).replace(/^.*\/api/, '/api'), status: r.status(), body: await r.json() }); } catch {} } });
  await t.waitForLoadState('domcontentloaded').catch(() => {}); await sleep(14000);
  const summary = await t.evaluate(() => [...document.querySelectorAll('tr, [class*="summary"], [class*="total"]')].map(e => e.innerText.replace(/\s+/g, ' ').trim()).filter(s => /summary|total/i.test(s)).slice(0, 6));
  const dateLines = (await t.locator('main').innerText().catch(() => '')).split('\n').filter(l => /Date|Last 12|Custom|\d{2}\/\d{2}\/\d{4}/i.test(l)).slice(0, 4);
  const { shot: s } = await import('./common.mjs');
  const repPic = await s(t, 'SV-11826', 'report-summary-row', { fullPage: true });
  const repData = repApi.length ? repApi : api.slice(n1).filter(a => !a.url.includes('/dashboard/'));
  E.tickets['SV-11826'] = { tile, tile_server: tileApi, report: { landed: t.url(), date_lines: dateLines, summary_rows: summary, at_utc: new Date().toISOString(), server: repData.map(a => ({ url: a.url, status: a.status, summary: a.body?.data?.summary ?? a.body?.summary ?? a.body?.data?.totals ?? null, keys: a.body?.data ? Object.keys(a.body.data).slice(0, 15) : null })) }, pictures: [tilePic, repPic] };
  console.log('SV-11826', JSON.stringify({ tile, summary, dateLines, landed: t.url().replace(APP, '') }));
  if (p2) await p2.close();
}

await goDash();
E.rule99 = await finish(page, loc, rule99);
E.observed_end_utc = new Date().toISOString();
save('_batch1_hd', E);
console.log('RULE99 all_match', E.rule99.all_match, E.rule99.header_start.shows_location, E.rule99.header_end.shows_location, app_version);
await browser.close();
