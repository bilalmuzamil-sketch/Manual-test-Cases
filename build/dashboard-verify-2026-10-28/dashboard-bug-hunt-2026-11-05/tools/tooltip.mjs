// Area 5.4 — chart tooltip values equal the data (Revenue expanded chart, Last Quarter; TE expanded chart, Last Quarter).
import { boot, LOC, gotoDash, shot, save, sleep, netlog, setRange, finish } from './hb.mjs';
const loc = LOC.HD; const { browser, page, rule99, app_version } = await boot(loc); const net = netlog(page, '/api/dashboard/reports'); const ev = { app_version, r: {} };
await gotoDash(page);
for (const [k, key] of [['revenueKpi', 'revenueSeries'], ['billingEfficiencyKpi', 'invoicingEfficiencyByAdvisorSeries']]) {
  await setRange(page, k, 'Last Quarter'); await page.locator(`[data-test-id="btn_toggle_details_${k}"]`).click(); await sleep(7000);
  const data = net.filter(r => r.url.includes('2026-07-01') && r.body?.data?.[key]).map(r => r.body.data[key]).at(-1);
  const panel = page.locator('[data-test-id="hero_detail_panel"]').first();
  const el = (await panel.locator('canvas').count()) ? panel.locator('canvas').first() : panel.locator('svg').first(); const box = await el.boundingBox();
  const tips = [];
  for (let i = 1; i < 80 && box; i++) { await page.mouse.move(box.x + box.width * i / 80, box.y + box.height * 0.5); await sleep(90);
    const t = await page.evaluate(() => { const c = [...document.querySelectorAll('body div')].filter(d => { const s = getComputedStyle(d); return (s.position === 'absolute' || s.position === 'fixed') && s.visibility !== 'hidden' && s.opacity !== '0' && d.offsetWidth > 40 && /\d/.test(d.innerText) && d.innerText.length < 300 && /(Nov|Oct|Sep|Aug|Jul|Jun|Week|20\d\d)/.test(d.innerText); }); return c.length ? c[c.length - 1].innerText.replace(/\s+/g, ' ').trim() : null; });
    if (t && tips.at(-1) !== t) tips.push(t); }
  await shot(page, 'area5', `5.4-${k}-hover`);
  ev.r[k] = { data, tips, kind: (await panel.locator('canvas').count()) ? 'canvas' : 'svg' };
  console.log(k, ev.r[k].kind, 'data', JSON.stringify(data).slice(0, 500)); console.log(' tips', JSON.stringify(tips).slice(0, 1400));
  await page.locator(`[data-test-id="btn_toggle_details_${k}"]`).click(); await sleep(1500);
}
ev.rule99 = await finish(page, loc, rule99); save('area5', 'tooltip-HD', ev); console.log(app_version, ev.rule99.all_match); await browser.close();
