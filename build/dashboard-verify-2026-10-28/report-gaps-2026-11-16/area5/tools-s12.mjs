// Area 5: Dashboard PRD (Confluence 788430850 v53, last modified 22 Oct 2026) S12-R7..S12-R10, measured from box positions.
// Heavy Duty (Asia/Karachi), 1920x1080 / 1536x864 / 1280x800 / 1024x768 / 390x844, light and dark. Run: TZ=Asia/Karachi node area5/tools-s12.mjs
import { boot, LOC, APP, sleep, setTheme, save, rule99 } from '../tools/sboot.mjs';
const EV = new URL('./evidence/', import.meta.url).pathname; const loc = LOC.HD;
const { browser, page } = await boot(loc); const ev = { prd: 'Dashboard, Confluence 788430850 v53 (last modified 22 Oct 2026)', start: await rule99(page, loc), runs: [] };
const SIZES = [[1920, 1080], [1536, 864], [1280, 800], [1024, 768], [390, 844]];
const REPORTS = ['sales', 'service-advisor-analysis', 'technician-efficiency', 'technician-utilization'];
const rect = h => h ? { t: Math.round(h.top), b: Math.round(h.bottom), l: Math.round(h.left), r: Math.round(h.right), h: Math.round(h.height) } : null;
async function reportState() {
  return page.evaluate(() => {
    const R = e => { if (!e) return null; const r = e.getBoundingClientRect(); return { t: Math.round(r.top), b: Math.round(r.bottom), h: Math.round(r.height) }; };
    const panel = document.querySelector('[data-test-id="report_visualization_panel"]');
    const panelShown = !!panel && panel.offsetParent !== null && panel.getBoundingClientRect().height > 0;
    const scrollers = [...document.querySelectorAll('.q-table__middle, .q-virtual-scroll, .q-table__container, [class*="scroll"]')].filter(e => e.scrollHeight > e.clientHeight + 2 && getComputedStyle(e).overflowY !== 'visible' && e.querySelector('tr, [role="row"]'));
    const sc = scrollers.sort((a, b) => b.clientHeight - a.clientHeight)[0] || null;
    const body = [...document.querySelectorAll('tbody tr, [role="row"]')].filter(r => r.getBoundingClientRect().height > 8 && (r.innerText || '').trim());
    const pb = panel ? panel.getBoundingClientRect().bottom : 0;
    const visRows = body.filter(r => { const x = r.getBoundingClientRect(); return x.top >= pb - 1 && x.bottom <= innerHeight + 1 && x.top >= 0; }).length;
    const filters = document.querySelector('.date-range-label')?.closest('div');
    const toggle = [...document.querySelectorAll('[data-test-id^="btn_toggle_visualization_"]')][0];
    return { url: location.pathname, vh: innerHeight, vw: innerWidth, panelShown, panel: R(panelShown ? panel : null), toggleText: toggle?.innerText?.trim() || null,
      table_scroller: sc ? { cls: sc.className.slice(0, 60), scrollTop: sc.scrollTop, scrollH: sc.scrollHeight, clientH: sc.clientHeight, box: R(sc) } : null,
      body_rows: body.length, full_rows_visible_below_chart: visRows, filters: R(filters), windowScrollY: Math.round(scrollY), docH: document.documentElement.scrollHeight,
      sideways: document.documentElement.scrollWidth > innerWidth };
  });
}
for (const theme of ['light', 'dark']) {
  await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForSelector('[data-test-id="hero_value_revenueKpi"]', { timeout: 90000 }); await sleep(4000);
  ev[theme + '_body_bg'] = await setTheme(page, theme);
  for (const [w, h] of SIZES) {
    await page.setViewportSize({ width: w, height: h }); const run = { theme, w, h, reports: {}, r9: null, r10: null };
    // ---- S12-R7 / S12-R8 on each report that shows a chart
    for (const rep of REPORTS) {
      await page.goto(APP + '/reports/' + rep, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {}); await sleep(6000);
      let s0 = await reportState();
      if (!s0.panelShown && /show/i.test(s0.toggleText || '')) { await page.locator('[data-test-id^="btn_toggle_visualization_"]').first().click(); await sleep(4000); s0 = await reportState(); }
      let s1 = null;
      if (s0.table_scroller) {
        const b = s0.table_scroller.box; await page.mouse.move(Math.round(w / 2), Math.round(Math.min(h - 10, (b.t + b.b) / 2))); await page.mouse.wheel(0, 400); await sleep(1200); s1 = await reportState();
      } else if (s0.body_rows) { const y = Math.min(h - 20, (s0.panel?.b || 300) + 60); await page.mouse.move(Math.round(w / 2), y); await page.mouse.wheel(0, 400); await sleep(1200); s1 = await reportState(); }
      const shotName = `${theme}-${w}-${rep}`; if (w === 1536 || w === 390) await page.screenshot({ path: EV + shotName + '.png' });
      const chartStill = s1 && s0.panel && s1.panel && Math.abs(s1.panel.t - s0.panel.t) <= 1;
      const filtersStill = s1 && s0.filters && s1.filters && Math.abs(s1.filters.t - s0.filters.t) <= 1;
      const rowsMoved = s1 && s0.table_scroller && s1.table_scroller && s1.table_scroller.scrollTop > s0.table_scroller.scrollTop;
      run.reports[rep] = { before: s0, after: s1,
        R7: !s0.panelShown ? 'NO CHART SHOWN' : (s0.full_rows_visible_below_chart >= 1 && (s0.table_scroller ? s0.table_scroller.scrollH > s0.table_scroller.clientH : true) ? 'PASS' : 'FAIL'),
        R8: !s0.panelShown ? 'NO CHART SHOWN' : !s0.table_scroller ? (s0.body_rows ? 'NO INNER TABLE SCROLL (page scrolls)' : 'NO ROWS') : (rowsMoved && chartStill && filtersStill ? 'PASS' : 'FAIL'), shot: (w === 1536 || w === 390) ? shotName + '.png' : null };
      console.log(theme, w, rep, run.reports[rep].R7, run.reports[rep].R8, 'rowsVis', s0.full_rows_visible_below_chart, 'panel', JSON.stringify(s0.panel), 'sc', JSON.stringify(s0.table_scroller));
    }
    // ---- S12-R9: tile date picker stays with its tile; wheel over the picker does not scroll the page
    await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForSelector('[data-test-id="hero_value_revenueKpi"]', { timeout: 90000 }); await sleep(5000);
    const R9 = {};
    for (const k of ['revenueKpi', 'salesByCustomer']) {
      const trig = page.locator(`[data-test-id="date-range-selector_hero_range_${k}_trigger"]`); await trig.scrollIntoViewIfNeeded().catch(() => {}); await sleep(500);
      await trig.click(); await sleep(1300);
      const m = async () => page.evaluate(k => { const t = document.querySelector(`[data-test-id="date-range-selector_hero_range_${k}_trigger"]`)?.getBoundingClientRect();
        const menus = [...document.querySelectorAll('.q-menu, .q-dialog__inner')].filter(e => e.getBoundingClientRect().height > 20); const p = menus.at(-1)?.getBoundingClientRect();
        return { trig: t && { t: Math.round(t.top), b: Math.round(t.bottom), l: Math.round(t.left) }, picker: p && { t: Math.round(p.top), b: Math.round(p.bottom), l: Math.round(p.left), r: Math.round(p.right) }, scrollY: Math.round(scrollY), dialog: !!document.querySelector('.q-dialog__inner') }; }, k);
      const a = await m(); if (!a.picker) { R9[k] = { verdict: 'PICKER DID NOT OPEN', a }; await page.keyboard.press('Escape'); continue; }
      await page.mouse.move(Math.round((a.picker.l + a.picker.r) / 2), Math.round((a.picker.t + Math.min(a.picker.b, h - 5)) / 2)); await page.mouse.wheel(0, 500); await sleep(900); const b = await m();
      await page.mouse.move(8, Math.round(h * 0.6)); await page.mouse.wheel(0, 500); await sleep(900); const c = await m();
      if (w === 1536 && k === 'revenueKpi') await page.screenshot({ path: EV + `${theme}-${w}-r9-${k}.png` });
      const off = x => x.picker && x.trig ? [x.picker.t - x.trig.b, x.picker.l - x.trig.l] : null;
      const stays = x => !x.picker || a.dialog || (off(x) && Math.abs(off(x)[0] - off(a)[0]) <= 2 && Math.abs(off(x)[1] - off(a)[1]) <= 2);
      R9[k] = { a, overPicker: b, outside: c, page_scrolled_while_over_picker: b.scrollY !== a.scrollY, stays_with_tile_after_outside_scroll: stays(c),
        verdict: (b.scrollY === a.scrollY && stays(b) && stays(c)) ? 'PASS' : 'FAIL' };
      await page.keyboard.press('Escape'); await sleep(600); await page.evaluate(() => scrollTo(0, 0)); await sleep(400);
      console.log(theme, w, 'R9', k, R9[k].verdict, JSON.stringify({ a: a.scrollY, b: b.scrollY, c: c.scrollY, offA: off(a), offB: off(b), offC: off(c) }));
    }
    run.r9 = R9;
    // ---- S12-R10: a chart filter chip low on the page opens its list without covering the top menu bar
    const R10 = {};
    for (const k of ['billingEfficiencyKpi', 'techEfficiencyKpi', 'techUtilizationKpi', 'revenueKpi']) {
      const tog = page.locator(`[data-test-id="btn_toggle_details_${k}"]`); if (!(await tog.count())) { R10[k] = { verdict: 'NO DETAILS BUTTON' }; continue; }
      await tog.scrollIntoViewIfNeeded().catch(() => {}); await tog.click(); await sleep(4500);
      const chips = page.locator('[data-test-id="hero_detail_panel"] [data-test-id^="filter_chip_"]:not([data-test-id^="filter_chip_clear_"]):not([data-test-id^="filter_chip_resolved_"])');
      const n = await chips.count(); if (!n) { R10[k] = { verdict: 'NO CHART FILTER CHIP' }; await tog.click().catch(() => {}); await sleep(800); continue; }
      const chip = chips.first(); const id = await chip.getAttribute('data-test-id');
      // put the chip near the bottom edge of the window, so its list has to open upward
      await page.evaluate(id => { const e = document.querySelector(`[data-test-id="${id}"]`); const r = e.getBoundingClientRect(); scrollBy(0, r.bottom - innerHeight + 40); }, id); await sleep(700);
      await chip.click(); await sleep(1300);
      const g = await page.evaluate(id => { const hd = document.querySelector('header')?.getBoundingClientRect(); const c = document.querySelector(`[data-test-id="${id}"]`).getBoundingClientRect();
        const menu = [...document.querySelectorAll('.q-menu, .q-dialog__inner')].filter(e => e.getBoundingClientRect().height > 20).at(-1); const m = menu?.getBoundingClientRect();
        const inner = menu ? [...menu.querySelectorAll('*')].find(e => e.scrollHeight > e.clientHeight + 2 && getComputedStyle(e).overflowY !== 'visible') : null;
        return { header: hd && { b: Math.round(hd.bottom) }, chip: { t: Math.round(c.top), b: Math.round(c.bottom) }, menu: m && { t: Math.round(m.top), b: Math.round(m.bottom), h: Math.round(m.height) }, opened_upward: m ? m.bottom <= c.top + 2 : null, scrolls_inside: !!(inner || (menu && menu.scrollHeight > menu.clientHeight + 2)), dialog: !!document.querySelector('.q-dialog__inner'), vh: innerHeight }; }, id);
      if (w === 1536 || w === 1024) await page.screenshot({ path: EV + `${theme}-${w}-r10-${k}.png` });
      R10[k] = { chip: id, ...g, verdict: !g.menu ? 'LIST DID NOT OPEN' : (g.menu.t >= (g.header?.b ?? 0) - 1 && g.menu.b <= g.vh + 1 ? 'PASS' : 'FAIL') };
      console.log(theme, w, 'R10', k, id, R10[k].verdict, JSON.stringify(g));
      await page.keyboard.press('Escape'); await sleep(500); await page.evaluate(() => scrollTo(0, 0)); await sleep(300); await tog.click().catch(() => {}); await sleep(900);
    }
    run.r10 = R10; ev.runs.push(run); save(EV + 's12-r7-r10.json', ev);
  }
}
await page.setViewportSize({ width: 1920, height: 1080 }); ev.restored_theme_bg = await setTheme(page, 'light');
ev.end = await rule99(page, loc); save(EV + 's12-r7-r10.json', ev); console.log('build start/end', ev.start.app_version, ev.end.app_version, 'zones', ev.start.all_zones_match, ev.end.all_zones_match);
await browser.close();
