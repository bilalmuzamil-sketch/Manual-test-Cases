// Area 7 — Story 12 visual conformance, measured (not judged by taste): S12-R1..R4, R11, R12, R13, plus cut-off text inside tiles.
import { boot, LOC, gotoDash, shot, save, sleep, finish } from './hb.mjs';
const loc = LOC.HD; const { browser, page, rule99, app_version } = await boot(loc, { viewport: { width: 1920, height: 1080 } });
const ev = { app_version, runs: [] };
await gotoDash(page);
// a long date label on Revenue (S12-R13): custom Nov 3 – Nov 20
await page.locator('[data-test-id="date-range-selector_hero_range_revenueKpi_trigger"]').click(); await sleep(900);
const cal = page.locator('[data-test-id="date-range-selector_hero_range_revenueKpi_calendar"]');
await cal.locator('button').filter({ hasText: /^3$/ }).first().click(); await sleep(300); await cal.locator('button').filter({ hasText: /^20$/ }).first().click(); await sleep(300);
await page.locator('[data-test-id="button_hero_range_revenueKpi_apply"]').click(); await sleep(4000);
const measure = () => page.evaluate(() => {
  const lum = c => { const m = c.match(/\d+(\.\d+)?/g)?.map(Number) || [0, 0, 0]; const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return +(0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2])).toFixed(3); };
  const K = ['revenueKpi', 'billingEfficiencyKpi', 'techEfficiencyKpi', 'techUtilizationKpi', 'salesByCustomer', 'atRiskHero'];
  const q = s => document.querySelector(`[data-test-id="${s}"]`);
  const tiles = Object.fromEntries(K.map(k => { const t = q('hero_tile_' + k); const r = t?.getBoundingClientRect(); return [k, r ? { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } : null]; }));
  const text = {}; for (const k of K) { const t = q('hero_tile_' + k); if (!t) continue;
    const label = [...t.querySelectorAll('*')].find(e => e.children.length === 0 && e.innerText?.trim() && !/^(event|expand_more|open_in_new|schedule)$/.test(e.innerText.trim()));
    const meta = q('hero_meta_' + k); const chip = q(`date-range-selector_hero_range_${k}_trigger`) || [...t.querySelectorAll('button')].find(b => /Days/.test(b.innerText));
    const chipText = chip ? [...chip.querySelectorAll('*')].find(e => e.children.length === 0 && /\d|Month|Year|Week|Quarter|Days/.test(e.innerText || '')) || chip : null;
    text[k] = { label: label && { t: label.innerText.trim(), c: getComputedStyle(label).color, L: lum(getComputedStyle(label).color) }, meta: meta && { c: getComputedStyle(meta).color, L: lum(getComputedStyle(meta).color) }, chip: chipText && { t: chipText.innerText.trim().slice(0, 40), c: getComputedStyle(chipText).color, L: lum(getComputedStyle(chipText).color) },
      headline_px: parseFloat(getComputedStyle(q('hero_value_' + k) || t).fontSize),
      cut: [...t.querySelectorAll('*')].filter(e => e.children.length === 0 && e.innerText?.trim() && e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== 'visible').map(e => e.innerText.trim().slice(0, 60)),
      overflow_tile: [...t.querySelectorAll('*')].filter(e => { const r = e.getBoundingClientRect(), R = t.getBoundingClientRect(); return e.children.length === 0 && e.innerText?.trim() && r.width > 0 && (r.right > R.right + 1 || r.left < R.left - 1); }).map(e => e.innerText.trim().slice(0, 60)) }; }
  return { vw: innerWidth, docScrollW: document.documentElement.scrollWidth, sideways: document.documentElement.scrollWidth > innerWidth, bodyBg: getComputedStyle(document.body).backgroundColor, tiles, text };
});
const themes = ['light', 'dark'];
for (const theme of themes) {
  if (theme === 'dark') { await page.setViewportSize({ width: 1920, height: 1080 }); await sleep(800); await page.locator('header .short-text-content').first().click(); await sleep(1200); await page.locator('.q-menu').last().getByText('Dark', { exact: true }).click(); await sleep(1500); await page.keyboard.press('Escape'); await sleep(800); }
  for (const [w, h] of [[1920, 1080], [1536, 864], [1280, 800], [1024, 768], [390, 844]]) {
    await page.setViewportSize({ width: w, height: h }); await sleep(2500);
    const m = await measure(); const name = `${theme}-${w}`;
    await shot(page, 'area7-visual', name, { fullPage: true });
    // S12-R11 dark picker / S12-R12 small-screen picker after scrolling
    let picker = null;
    if (w === 1920 || w === 390) {
      if (w === 390) { await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await sleep(800); }
      const k = w === 390 ? 'salesByCustomer' : 'revenueKpi';
      await page.locator(`[data-test-id="date-range-selector_hero_range_${k}_trigger"]`).scrollIntoViewIfNeeded().catch(() => {});
      await page.locator(`[data-test-id="date-range-selector_hero_range_${k}_trigger"]`).click(); await sleep(1200);
      picker = await page.evaluate(() => { const m = [...document.querySelectorAll('.q-menu')].at(-1); if (!m) return null; const r = m.getBoundingClientRect(); const lum = c => { const v = c.match(/\d+(\.\d+)?/g)?.map(Number) || [0, 0, 0]; return +((0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]) / 255).toFixed(3); };
        const preset = m.querySelector('[data-test-id$="_preset_this-month"]') || m; const rangeT = m.querySelector('[data-test-id$="_range_indicator"]');
        return { visible_in_viewport: r.top >= 0 && r.bottom <= innerHeight + 1 && r.left >= 0 && r.right <= innerWidth + 1, rect: { t: Math.round(r.top), b: Math.round(r.bottom), l: Math.round(r.left), r: Math.round(r.right) }, bg: getComputedStyle(m).backgroundColor, bgL: lum(getComputedStyle(m).backgroundColor), presetColor: getComputedStyle(preset).color, presetL: lum(getComputedStyle(preset).color), rangeColor: rangeT && getComputedStyle(rangeT).color }; });
      await shot(page, 'area7-visual', `${name}-picker`); await page.keyboard.press('Escape'); await sleep(600);
      if (w === 390) { await page.evaluate(() => window.scrollTo(0, 0)); await sleep(500); }
    }
    ev.runs.push({ theme, w, h, m, picker }); console.log(name, 'sideways', m.sideways, m.docScrollW, '| rows', JSON.stringify(Object.fromEntries(Object.entries(m.tiles).map(([k, v]) => [k, v && `${v.x},${v.y}`]))), '| picker', JSON.stringify(picker)?.slice(0, 220));
  }
}
// restore Light
await page.setViewportSize({ width: 1920, height: 1080 }); await sleep(800); await page.locator('header .short-text-content').first().click(); await sleep(1200); await page.locator('.q-menu').last().getByText('Light', { exact: true }).click(); await sleep(1200); await page.keyboard.press('Escape');
ev.rule99 = await finish(page, loc, rule99); save('area7-visual', 'visual', ev); console.log(app_version, ev.rule99.all_match);
await browser.close();
