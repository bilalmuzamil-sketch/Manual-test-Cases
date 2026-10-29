// Worker F1 browser harness (filter recheck, 29 Oct 2026). Rule 99: boot2 change-locations the session to the
// location's zone and sets the app's own localStorage['timezone']; the browser context runs with timezoneId = the
// zone; the node process must run with TZ = the zone (asserted). All four are recorded in meta. SECRET-FREE.
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
export const APP = 'https://app.staging.shopview.com';
export const L = { HD: ['b3c8c820-f815-4cf1-8938-10956c5ee71a', 'Asia/Karachi', 'Staging Heavy Duty - 9919'],
  LETH: ['f8a8b802-7780-4b16-bf10-343caeb616b2', 'America/Edmonton', 'Staging Lethbridge - 4310'],
  DVI: ['39522bc6-abca-4f67-bd12-2840043c2d68', 'America/Toronto', 'DVI Test'] };
export const EV = '/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f1';
const SKIP_LS = new Set(['user', 'token', 'fe_permissions_wrapper']);

export async function fresh(locKey, label, { downloads = false } = {}) {
  const [WP, TZ, LOC] = L[locKey];
  if (process.env.TZ !== TZ) { console.error('run with TZ=' + TZ); process.exit(2); }
  const { browser, page } = await boot2('admin', { workplaceId: WP, timezone: TZ,
    contextOptions: { viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2, timezoneId: TZ, acceptDownloads: downloads } });
  await page.evaluate(w => localStorage.setItem('location', JSON.stringify(w)), WP);
  const meta = { label, location: LOC, workplace_id: WP, location_tz: TZ, process_TZ: process.env.TZ,
    process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, session_change_location: { workplace_id: WP, workplace_timezone: TZ },
    started_utc: new Date().toISOString() };
  meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
  meta.app_timezone_key = await page.evaluate(() => localStorage.getItem('timezone'));
  meta.storage_at_start = await lsDump(page);
  const reqs = []; let phase = 'load';
  page.on('response', r => { const u = r.url(); if (u.startsWith('https://api.staging.shopview.com/api/') && r.request().method() === 'GET' && !/individual-punch-clock|notifications|fe-permissions|organization|view-profile|my-workplaces|my-current-task|feature/.test(u))
    reqs.push({ phase, status: r.status(), xloc: r.request().headers()['x-location-id'] || null, url: decodeURIComponent(u.replace('https://api.staging.shopview.com', '')) }); });
  const B = b => b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) };
  const c = {
    page, browser, meta, reqs, TZ, WP, LOC,
    setPhase: p => { phase = p; },
    box: async loc => B(await loc.first().boundingBox({ timeout: 3000 }).catch(() => null)),
    txt: async loc => (await loc.first().innerText({ timeout: 3000 }).catch(() => '')).replace(/\s+/g, ' ').trim(),
    go: async (path, wait = 12000) => { await page.goto(APP + path, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(wait);
      if (!meta.header_at_start) meta.header_at_start = (await page.locator('header').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 2000);
      meta.appVersion = meta.appVersion || await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null); },
    controls: async (scope = 'body') => page.locator(scope).first().evaluate(root => {
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const out = [];
      for (const e of root.querySelectorAll('[data-test-id]')) { const id = e.getAttribute('data-test-id');
        if (!/filter_chip_|_trigger$|search|^select_|^toggle_|tab|column|sort|switch|checkbox|as_of|date_input|chip/i.test(id) || !vis(e)) continue;
        out.push({ id, text: e.innerText.replace(/\s+/g, ' ').trim().slice(0, 80), checked: e.getAttribute('aria-checked'), selected: e.getAttribute('aria-selected'), value: e.value ?? e.querySelector?.('input')?.value ?? null }); }
      const tabs = [...root.querySelectorAll('.q-tab')].filter(vis).map(t => (t.classList.contains('q-tab--active') ? '*' : '') + t.innerText.replace(/\s+/g, ' ').trim());
      const inputs = [...root.querySelectorAll('input')].filter(vis).map(i => ({ ph: i.placeholder, v: i.value, aria: i.getAttribute('aria-label') })).filter(i => i.v || i.ph);
      const heads = [...root.querySelectorAll('thead th')].filter(vis).map(t => t.innerText.replace(/\s+/g, ' ').replace(/arrow_\w+|info_outline/g, '').trim()).filter(Boolean);
      return { chips: out, tabs, inputs, heads };
    }),
    rows: async (sel = 'tbody tr', n = 400) => page.locator(sel).evaluateAll((trs, n) => trs.slice(0, n).map(tr => [...tr.querySelectorAll('td')].map(td => td.innerText.replace(/\s+/g, ' ').trim())), n),
    shot: async (name, extra = {}) => { const f = `${EV}/${meta.label}-${name}.png`; await page.screenshot({ path: f }); (meta.shots ||= {})[name] = { file: f.split('/').pop(), at_utc: new Date().toISOString(), ...extra }; },
    ls: () => lsDump(page),
  };
  return c;
}
async function lsDump(page) {
  return page.evaluate(skip => Object.fromEntries(Object.keys(localStorage).sort().map(k => [k, skip.includes(k) ? '(identity, not a filter)' : String(localStorage.getItem(k)).slice(0, 300)])), [...SKIP_LS]);
}
export async function finish(c, out) {
  c.meta.storage_at_end = await c.ls().catch(() => null);
  c.meta.url_at_end = c.page.url().replace(APP, '');
  // Location guard (coordinator, 29 Oct): header names the intended location at start AND end, every API request carried
  // X-Location-ID = the intended workplace, and localStorage['location'] is still the intended workplace. Else INVALID.
  // a run that ends on a drawn picture (renderCsv) records the app header just before drawing, in meta.header_before_render
  c.meta.header_at_end = c.meta.header_before_render || (await c.page.locator('header').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 2000);
  const xl = [...new Set(c.reqs.map(r => r.xloc).filter(Boolean))];
  c.meta.location_guard = { header_start_ok: (c.meta.header_at_start || '').includes(c.LOC), header_end_ok: c.meta.header_at_end.includes(c.LOC),
    x_location_ids_seen: xl, x_location_ok: xl.length > 0 && xl.every(x => x === c.WP), storage_location_ok: (c.meta.storage_at_end || {}).location === JSON.stringify(c.WP) };
  c.meta.location_guard.VALID = Object.entries(c.meta.location_guard).filter(([k]) => k.endsWith('_ok')).every(([, v]) => v);
  c.meta.finished_utc = new Date().toISOString();
  const res = { meta: c.meta, ...out, requests: dedupe(c.reqs) };
  fs.writeFileSync(`${EV}/${c.meta.label}.ui.json`, JSON.stringify(res, null, 1));
  await c.browser.close();
  return res;
}
function dedupe(r) { const s = new Set(); return r.filter(x => { const k = x.phase + x.url; if (s.has(k)) return false; s.add(k); return true; }); }
// Report filter chip date presets (data-test-id filter_chip_range / filter_preset_range_<v>)
export async function reportPreset(c, v) {
  // auto-detects the date chip (filter_chip_range / filter_chip_dateRange) and its preset ids (filter_preset_<chip>_<v>)
  const { page } = c; const chip = page.locator('[data-test-id="filter_chip_range"], [data-test-id="filter_chip_dateRange"]').first();
  const chipId = await chip.getAttribute('data-test-id'); const prefix = 'filter_preset_' + chipId.replace('filter_chip_', '') + '_';
  await chip.click(); await page.waitForTimeout(1500);
  const presets = await page.locator(`[data-test-id^="${prefix}"]`).evaluateAll((es, p) => es.map(e => e.getAttribute('data-test-id').replace(p, '') + '=' + e.innerText.trim()), prefix);
  if (v) { const want = presets.find(x => x.split('=')[0] === v) ? v : (presets.find(x => x.split('=')[0].replace(/-/g, '_') === v) || '').split('=')[0];
    await page.locator(`[data-test-id="${prefix}${want}"]`).first().click({ timeout: 8000 }); await page.waitForTimeout(1000); }
  const ap = page.locator('.q-menu button').filter({ hasText: /^\s*Apply\s*$/ }); if (await ap.count()) await ap.first().click().catch(() => {});
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(8000);
  return { chipId, presets, chip_after: (await chip.innerText().catch(() => '')).replace(/\s+/g, ' ').trim() };
}
// Dashboard tile date range (preset or custom days in the calendar's month after `back` arrow clicks)
export async function tileRange(c, key, { preset, days, back = 0 }) {
  const { page, txt } = c;
  await page.locator(`[data-test-id="date-range-selector_hero_range_${key}_trigger"]`).click(); await page.waitForTimeout(1500);
  const m = page.locator('.q-menu').last();
  const presets = await m.locator('[data-test-id*="_preset_"]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id').split('_preset_')[1]));
  if (preset) await m.locator(`[data-test-id="date-range-selector_hero_range_${key}_preset_${preset}"]`).click();
  if (days) { const cal = m.locator(`[data-test-id="date-range-selector_hero_range_${key}_calendar"]`);
    for (let i = 0; i < back; i++) { await cal.locator('.q-date__arrow button, .q-date__navigation button').first().click(); await page.waitForTimeout(600); }
    // The calendar swallows the first click (it only takes focus): click the start day until a range edit begins.
    const day = d => cal.locator('.q-date__calendar-item--in button').filter({ hasText: new RegExp(`^${d}$`) }).first();
    for (let k = 0; k < 3; k++) { await day(days[0]).click(); await page.waitForTimeout(700);
      if (/edit-range/.test(await day(days[0]).evaluate(e => e.closest('.q-date__calendar-item').className))) break; }
    await day(days[1]).click(); await page.waitForTimeout(800); }
  await page.waitForTimeout(800);
  const indicator = await txt(m.locator(`[data-test-id="date-range-selector_hero_range_${key}_range_indicator"]`));
  const ap = m.locator(`[data-test-id="button_hero_range_${key}_apply"]`); if (await ap.count()) await ap.click().catch(() => {});
  await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(7000);
  return { presets, indicator, trigger: await txt(page.locator(`[data-test-id="date-range-selector_hero_range_${key}_trigger"]`)) };
}
export async function tile(c, key) {
  const { page, txt } = c;
  return { value: await txt(page.locator(`[data-test-id="hero_value_${key}"]`)), meta: await txt(page.locator(`[data-test-id="hero_meta_${key}"]`)),
    range: await txt(page.locator(`[data-test-id="date-range-selector_hero_range_${key}_trigger"]`)) };
}
export async function details(c, key, open = true) {
  const { page } = c;
  if (open) { await page.locator(`[data-test-id="btn_toggle_details_${key}"]`).click(); await page.waitForTimeout(8000); }
  const panel = page.locator('[data-test-id="hero_detail_panel"]').first();
  return { controls: await c.controls('[data-test-id="hero_detail_panel"]').catch(() => null),
    rows: await panel.locator('tbody tr').evaluateAll(trs => trs.map(tr => [...tr.querySelectorAll('td')].map(td => td.innerText.replace(/\s+/g, ' ').trim())).filter(r => r.length)).catch(() => []) };
}
