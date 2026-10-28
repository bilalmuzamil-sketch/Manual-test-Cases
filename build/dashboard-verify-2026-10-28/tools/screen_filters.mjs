// Layer L1c — chart filters (PRD Story 8) on the Technician Efficiency, Technician Utilization and Billing Efficiency panels,
// Heavy Duty, This Month. SECRET-FREE. Output /tmp/cln/dv/out/filters.json + screenshots.
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const WP = 'b3c8c820-f815-4cf1-8938-10956c5ee71a';
const { browser, page } = await boot2('admin', { workplaceId: WP, timezone: 'Asia/Karachi' });
await page.evaluate(w => { localStorage.setItem('location', JSON.stringify(w)); for (const k of Object.keys(localStorage)) if (/filter|technician|advisor/i.test(k)) localStorage.removeItem(k); }, WP);
const responses = [];
page.on('response', async r => { const u = r.url(); if (u.includes('/api/dashboard/reports')) { try { responses.push({ url: decodeURIComponent(u).replace(/^.*\/api/, '/api'), body: await r.json() }); } catch {} } });
const out = [];
const go = async () => { await page.goto('https://app.staging.shopview.com/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForSelector('[data-test-id="hero_value_techEfficiencyKpi"]', { timeout: 90000 }); await page.waitForTimeout(6000); };
const panelState = async () => {
  const p = page.locator('[data-test-id="hero_detail_panel"]').first();
  return { filterLabel: (await p.locator('[data-test-id^="filter_chip_"]').first().innerText().catch(() => null))?.replace(/\n/g, ' '),
           chartCount: await p.locator('canvas, svg.apexcharts-svg, .echarts, [class*="chart"] canvas').count(), legend: (await p.locator('[class*="legend"]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 300),
           rows: (await p.locator('tbody tr').evaluateAll(trs => trs.map(tr => tr.innerText.split('\t')[0].trim()).filter(Boolean)).catch(() => [])), text: (await p.innerText().catch(() => '')).slice(0, 300) };
};
await go();
for (const [key, kind] of [['techEfficiencyKpi', 'Technician'], ['techUtilizationKpi', 'Technician'], ['billingEfficiencyKpi', 'Advisor']]) {
  const tileBefore = await page.locator(`[data-test-id="hero_value_${key}"]`).innerText();
  await page.locator(`[data-test-id="btn_toggle_details_${key}"]`).click(); await page.waitForTimeout(5000);
  const s0 = await panelState();
  const p = page.locator('[data-test-id="hero_detail_panel"]').first();
  await p.locator('[data-test-id^="filter_chip_"]').first().click(); await page.waitForTimeout(1200);
  const menu = page.locator('.q-menu.filter-menu').last();
  const opts = (await menu.innerText()).split('\n').filter(Boolean);
  const n0 = responses.length;
  // technicians → untick the first named technician; advisor → choose the first named advisor
  const first = menu.locator('[role="checkbox"]:not([data-test-id^="filter_select_all"]), [role="radio"], [role="option"]').first();
  const firstName = ((await first.getAttribute('aria-label')) || (await first.innerText())).trim();
  await first.click(); await page.waitForTimeout(800); await page.keyboard.press('Escape');
  for (let i = 0; i < 40 && responses.length === n0; i++) await page.waitForTimeout(250);
  await page.waitForTimeout(3500);
  const s1 = await panelState(); const tileAfter = await page.locator(`[data-test-id="hero_value_${key}"]`).innerText();
  const req = responses.slice(n0).map(r => r.url);
  await page.screenshot({ path: `/tmp/cln/dv/out/shots/filter-${key}-one.png`, fullPage: true });
  let sAll = null;
  if (kind === 'Technician') {             // untick every technician → chart + table hidden (S8-N1/N1a)
    await p.locator('[data-test-id^="filter_chip_"]').first().click(); await page.waitForTimeout(1000);
    await page.locator('.q-menu.filter-menu').last().locator('[data-test-id^="filter_clear_selection_"]').click(); await page.waitForTimeout(800);
    await page.keyboard.press('Escape'); await page.waitForTimeout(3000);
    sAll = await panelState();
    await page.screenshot({ path: `/tmp/cln/dv/out/shots/filter-${key}-none.png`, fullPage: true });
  }
  out.push({ key, kind, tileBefore, tileAfter, options: opts.slice(0, 30), choice: firstName, before: s0, afterOne: s1, requests: req, afterNone: sAll });
  await page.locator(`[data-test-id="btn_toggle_details_${key}"]`).click().catch(() => {}); await page.waitForTimeout(1500);
}
// remembered between visits (S8-R6)
await go();
const remembered = [];
for (const [key] of [['techEfficiencyKpi'], ['techUtilizationKpi'], ['billingEfficiencyKpi']]) {
  await page.locator(`[data-test-id="btn_toggle_details_${key}"]`).click(); await page.waitForTimeout(5000);
  remembered.push({ key, state: await panelState() });
  await page.locator(`[data-test-id="btn_toggle_details_${key}"]`).click().catch(() => {}); await page.waitForTimeout(1500);
}
fs.writeFileSync('/tmp/cln/dv/out/filters.json', JSON.stringify({ observed_at_utc: new Date().toISOString(), out, remembered }, null, 1));
for (const o of out) console.log(o.key, '| choice', o.choice, '| tile', o.tileBefore, '->', o.tileAfter, '| rows', o.before.rows.length, '->', o.afterOne.rows.length, '| label', o.afterOne.filterLabel, '| req', o.requests.map(u => (u.match(/(tech\[\]|service_advisor\[\])=[^&]+/g) || []).length).join(','), '| none:', o.afterNone && `rows ${o.afterNone.rows.length} charts ${o.afterNone.chartCount} label ${o.afterNone.filterLabel}`);
for (const r of remembered) console.log('reload', r.key, r.state.filterLabel, 'rows', r.state.rows.length, 'charts', r.state.chartCount);
// restore: clear filter memory
await page.evaluate(() => { for (const k of Object.keys(localStorage)) if (/filter|technician|advisor/i.test(k)) localStorage.removeItem(k); });
await browser.close();
