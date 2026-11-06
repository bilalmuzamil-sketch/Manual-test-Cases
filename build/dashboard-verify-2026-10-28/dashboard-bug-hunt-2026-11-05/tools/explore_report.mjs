import { boot, LOC, gotoDash, tile, shot, save, sleep, reportState, waitIdle } from './hb.mjs';
const { browser, page, rule99, app_version } = await boot(LOC.HD);
await gotoDash(page);
const res = {};
for (const k of ['revenueKpi', 'techUtilizationKpi', 'salesByCustomer']) {
  await page.locator(`[data-test-id="link_report_${k}"]`).click(); await waitIdle(page);
  res[k] = await reportState(page);
  res[k].ids = await page.evaluate(() => [...new Set([...document.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')))].filter(x => !/^(button_desktop_nav|nav_)/.test(x)).slice(0, 120));
  await shot(page, 'explore', 'report-' + k, { fullPage: false });
  await page.goBack(); const tb=Date.now(); const ok = await page.waitForSelector(`[data-test-id="hero_value_${k}"]`, { timeout: 60000 }).then(()=>true).catch(()=>false);
  res[k].back = { ok, ms: Date.now()-tb, url: page.url(), tile: ok ? await tile(page, k) : null }; if (!ok) { await shot(page, 'explore', 'back-fail-' + k); await gotoDash(page); } else await sleep(3000);
}
save('explore', 'reports', { app_version, rule99, res });
console.log(JSON.stringify(res, null, 0).slice(0, 6000));
await browser.close();
