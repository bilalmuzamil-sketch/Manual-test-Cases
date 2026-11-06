// Q1 evidence — light theme, 1920 px: colour of the tile date-range and inactivity-window controls vs the tile label (S12-R2).
import { boot, LOC, gotoDash, shot, save, sleep, finish } from './hb.mjs';
const loc = LOC.HD; const { browser, page, rule99, app_version } = await boot(loc, { viewport: { width: 1920, height: 1080 } });
await gotoDash(page);
const theme = await page.evaluate(() => document.body.className.match(/body--(light|dark)/)?.[1]);
const m = await page.evaluate(() => { const out = [];
  for (const k of ['revenueKpi', 'billingEfficiencyKpi', 'techEfficiencyKpi', 'techUtilizationKpi', 'salesByCustomer', 'atRiskHero']) {
    const t = document.querySelector(`[data-test-id="hero_tile_${k}"]`); if (!t) continue;
    const ctl = [...t.querySelectorAll('button, [role="button"], .q-btn')].find(b => /Month|Months|Year|Quarter|Week|Days|\d{4}/.test(b.innerText)); if (!ctl) continue;
    const leaf = [...ctl.querySelectorAll('*')].find(e => e.children.length === 0 && /Month|Months|Year|Quarter|Week|Days|\d{4}/.test(e.innerText || '')) || ctl;
    const lab = [...t.querySelectorAll('*')].find(e => e.children.length === 0 && e.innerText?.trim() && !/^(event|expand_more|open_in_new|schedule)$/.test(e.innerText.trim()));
    const r = ctl.getBoundingClientRect(), lr = lab.getBoundingClientRect();
    out.push({ k, control_text: leaf.innerText.trim(), control_color: getComputedStyle(leaf).color, control_bg: getComputedStyle(ctl).backgroundColor, label_text: lab.innerText.trim(), label_color: getComputedStyle(lab).color, meta_color: getComputedStyle(document.querySelector(`[data-test-id="hero_meta_${k}"]`)).color, box: [r.left, r.top, r.right, r.bottom].map(Math.round), labelBox: [lr.left, lr.top, lr.right, lr.bottom].map(Math.round) }); }
  return out; });
const p = await shot(page, 'Q1-tile-date-controls-blue', 'light-1920', { clip: { x: 0, y: 60, width: 1920, height: 560 } });
const r99 = await finish(page, loc, rule99); save('Q1-tile-date-controls-blue', 'evidence', { app_version, theme, controls: m, shot: p, rule99: r99 });
console.log(app_version, theme, r99.all_match, JSON.stringify(m.map(x => [x.k, x.control_text, x.control_color, x.label_color, x.box])));
await browser.close();
