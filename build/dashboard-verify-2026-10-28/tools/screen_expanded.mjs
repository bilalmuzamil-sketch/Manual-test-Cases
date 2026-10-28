// Layer L1b — expanded panels (View details: chart + table) and report links (Story 6 / Story 10), per location.
// Records the panel's table text + the server rows it was drawn from, and where each report link lands.
// SECRET-FREE. Output /tmp/cln/dv/out/expanded-<wp>.json and screenshots in /tmp/cln/dv/out/shots/.
import fs from 'fs';
import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const WPS = [['b3c8c820-f815-4cf1-8938-10956c5ee71a','Staging Heavy Duty - 9919','Asia/Karachi'],['f8a8b802-7780-4b16-bf10-343caeb616b2','Staging Lethbridge - 4310','America/Edmonton'],['39522bc6-abca-4f67-bd12-2840043c2d68','DVI Test','America/Toronto']];
const KEYS = ['revenueKpi','billingEfficiencyKpi','techEfficiencyKpi','techUtilizationKpi','salesByCustomer','atRiskHero'];
const only = process.argv[2];
for (const [wid, wname, tz] of WPS) {
  if (only && !wname.includes(only)) continue;
  const { browser, page } = await boot2('admin', { workplaceId: wid, timezone: tz });
  await page.evaluate(w => { localStorage.setItem('location', JSON.stringify(w)); }, wid);
  const responses = [];
  page.on('response', async r => { const u = r.url(); if (u.includes('/api/dashboard/reports')) { try { responses.push({ url: decodeURIComponent(u).replace(/^.*\/api/, '/api'), status: r.status(), body: await r.json() }); } catch {} } });
  await page.goto('https://app.staging.shopview.com/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForSelector('[data-test-id="hero_value_revenueKpi"]', { timeout: 90000 }); await page.waitForTimeout(6000);
  const out = { workplace: wname, id: wid, tz, observed_at_utc: new Date().toISOString(), panels: [], links: [] };
  for (const key of KEYS) {
    const n0 = responses.length;
    await page.locator(`[data-test-id="btn_toggle_details_${key}"]`).click().catch(() => {});
    for (let i = 0; i < 40 && responses.length === n0; i++) await page.waitForTimeout(250);
    await page.waitForTimeout(4000);
    const panel = page.locator('[data-test-id="hero_detail_panel"]').first();
    const text = await panel.innerText().catch(() => '');
    const rows = await panel.locator('tbody tr').evaluateAll(trs => trs.map(tr => [...tr.querySelectorAll('td')].map(td => td.innerText.trim()))).catch(() => []);
    const heads = await panel.locator('thead th').allInnerTexts().catch(() => []);
    const openCount = await page.locator('[data-test-id="hero_detail_panel"]').count();
    await page.screenshot({ path: `/tmp/cln/dv/out/shots/${wid.slice(0, 8)}-expanded-${key}.png`, fullPage: true });
    out.panels.push({ key, openPanels: openCount, heads, rows, text: text.slice(0, 4000), requests: responses.slice(n0) });
    await page.locator(`[data-test-id="btn_toggle_details_${key}"]`).click().catch(() => {});   // close (S6: one open at a time)
    await page.waitForTimeout(1200);
  }
  for (const key of KEYS.filter(k => k !== 'atRiskHero')) {
    const link = page.locator(`[data-test-id="link_report_${key}"]`).first();
    const href = await link.getAttribute('href').catch(() => null);
    let landed = null, filterText = null;
    if (await link.count()) {
      const [p2] = await Promise.all([page.context().waitForEvent('page', { timeout: 8000 }).catch(() => null), link.click({ modifiers: [] }).catch(() => {})]);
      const target = p2 || page; await target.waitForTimeout(9000);
      landed = target.url(); filterText = (await target.locator('main').innerText().catch(() => '')).split('\n').filter(l => /Date|Custom|Month|Year|Quarter|Week|Last 12/i.test(l)).slice(0, 4).join(' | ');
      if (p2) await p2.close(); else { await page.goBack(); await page.waitForTimeout(6000); }
    }
    out.links.push({ key, href, landed, filterText, atRiskHasLink: await page.locator('[data-test-id="link_report_atRiskHero"]').count() });
  }
  fs.writeFileSync(`/tmp/cln/dv/out/expanded-${wid.slice(0, 8)}.json`, JSON.stringify(out));
  console.log(wname, out.panels.map(p => `${p.key}:${p.rows.length}rows/${p.openPanels}open`).join(' '), '|', out.links.map(l => `${l.key}->${(l.landed || '').replace(/^.*shopview.com/, '')}`).join(' '));
  await browser.close();
}
