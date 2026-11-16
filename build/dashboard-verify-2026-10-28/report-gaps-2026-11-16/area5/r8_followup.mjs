// Area 5 follow-up for S12-R8 on Technician Efficiency and Technician Utilization: the default range at Heavy Duty has
// 3 rows (nothing to scroll), so pick "Last 12 Months" in the report's own date filter, then wheel over the rows.
// R8 verdict = rows moved inside the table AND the chart top unchanged AND the window did not scroll.
import { boot, LOC, APP, sleep, setTheme, save, rule99 } from '../tools/sboot.mjs';
const EV = new URL('./evidence/', import.meta.url).pathname; const loc = LOC.HD; const { browser, page } = await boot(loc, { viewport: { width: 1536, height: 864 } });
const ev = { start: await rule99(page, loc), runs: [] };
const st = () => page.evaluate(() => { const p = document.querySelector('[data-test-id="report_visualization_panel"]'); const pr = p?.getBoundingClientRect();
  const sc = [...document.querySelectorAll('.q-table__middle, .q-virtual-scroll, .q-table__container, [class*="scroll"]')].filter(e => e.scrollHeight > e.clientHeight + 2 && getComputedStyle(e).overflowY !== 'visible' && e.querySelector('tr')).sort((a, b) => b.clientHeight - a.clientHeight)[0];
  const tb = document.querySelector('.q-table__top, .report-toolbar, header')?.getBoundingClientRect();
  return { chartTop: pr ? Math.round(pr.top) : null, chartH: pr ? Math.round(pr.height) : null, scrollTop: sc?.scrollTop ?? null, scH: sc?.scrollHeight ?? null, clH: sc?.clientHeight ?? null, box: sc ? (r => ({ t: Math.round(r.top), b: Math.round(r.bottom) }))(sc.getBoundingClientRect()) : null, winY: Math.round(scrollY), range: document.querySelector('[data-test-id*="date-range-selector"][data-test-id$="_trigger"]')?.innerText?.trim(), rows: document.querySelectorAll('tbody tr').length }; });
for (const [theme, w, h] of [['light', 1536, 864], ['light', 1024, 768], ['dark', 1536, 864]]) {
  if (theme === 'dark') { await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded' }); await sleep(6000); await setTheme(page, 'dark'); }
  await page.setViewportSize({ width: w, height: h });
  for (const rep of ['technician-efficiency', 'technician-utilization']) {
    await page.goto(APP + '/reports/' + rep, { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {}); await sleep(6000);
    const trig = page.locator('[data-test-id*="date-range-selector"][data-test-id$="_trigger"]').first();
    if (await trig.count()) { await trig.click(); await sleep(1200);
      const pre = page.locator('[data-test-id$="_preset_last-12-months"]').first();
      if (await pre.count()) await pre.click(); else await page.locator('.q-menu').last().getByText('Last 12 Months', { exact: true }).first().click().catch(() => {});
      await sleep(700); const ap = page.locator('[data-test-id*="_apply"]').last(); if (await ap.count()) await ap.click().catch(() => {}); else await page.locator('.q-menu').last().getByText('Apply', { exact: true }).first().click().catch(() => {});
      await sleep(7000); }
    const a = await st(); let b = null;
    if (a.box) { await page.mouse.move(Math.round(w / 2), Math.round((a.box.t + Math.min(a.box.b, h - 5)) / 2)); await page.mouse.wheel(0, 500); await sleep(1500); b = await st(); }
    if (w === 1536) await page.screenshot({ path: EV + `${theme}-${w}-r8-${rep}-after-scroll.png` });
    const verdict = !a.chartH ? 'NO CHART SHOWN' : !a.box ? 'ROWS STILL FIT, NOTHING TO SCROLL' : (b.scrollTop > a.scrollTop && b.chartTop === a.chartTop && b.winY === a.winY ? 'PASS' : 'FAIL');
    ev.runs.push({ theme, w, h, rep, before: a, after: b, R8: verdict }); console.log(theme, w, rep, verdict, JSON.stringify(a), JSON.stringify(b));
  }
}
await page.setViewportSize({ width: 1920, height: 1080 }); ev.restored = await setTheme(page, 'light'); ev.end = await rule99(page, loc); save(EV + 's12-r8-followup.json', ev); await browser.close();
