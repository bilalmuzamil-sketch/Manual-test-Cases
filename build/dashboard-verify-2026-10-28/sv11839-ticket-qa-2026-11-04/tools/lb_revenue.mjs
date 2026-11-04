// lb_revenue.mjs — Revenue tile, single-day ranges at Staging Lethbridge - 4310 (TZ=America/Edmonton). SECRET-FREE.
// SV-11821: Nov 4 2026 = 1 invoice (S11839-17591, seeded) + credit memo CM-4190 → split hidden → supporting line must read "1 Invoice".
// SV-11823: any share negative → split hidden, "{count} Invoices" (Nov 4; Jul 22 2026); all shares ≥ 0 incl. exactly 0 % → split shown (Apr 7 2026).
import fs from 'fs';
import { boot, finish, shot, save, sleep, LOC, APP, OUT } from './common.mjs';
const loc = LOC.LB;
const { browser, page, rule99, app_version } = await boot(loc);
const api = []; page.on('response', async r => { const u = r.url(); if (u.includes('/api/dashboard/reports') && u.includes('revenueKpi')) { try { api.push({ url: decodeURIComponent(u).replace(/^.*\/api/, '/api'), body: await r.json() }); } catch {} } });
const M = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const popup = () => page.locator('.date-range-popup').last();
const trig = () => page.locator('[data-test-id="date-range-selector_hero_range_revenueKpi_trigger"]');
const goDash = async () => { await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForSelector('[data-test-id="hero_value_revenueKpi"]', { timeout: 90000 }); await sleep(6000); };
async function gotoMonth(y, m) { for (let i = 0; i < 40; i++) { const t = (await popup().locator('.q-date__navigation').innerText()).replace(/\s+/g, ' ');
  const cur = +(t.match(/\b(20\d\d)\b/)[1]) * 12 + M.indexOf(M.find(x => t.includes(x))); if (cur === y * 12 + m) return; await popup().locator('.q-date__navigation .q-date__arrow button').nth(cur > y * 12 + m ? 0 : 1).click(); await sleep(300); } }
const box = async l => { const b = await l.first().boundingBox().catch(() => null); return b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) }; };
const R = {};
for (const [tag, y, m, d, tickets] of [['2026-11-04', 2026, 10, 4, ['SV-11821', 'SV-11823']], ['2026-07-22', 2026, 6, 22, ['SV-11823']], ['2026-04-07', 2026, 3, 7, ['SV-11823']]]) {
  await goDash(); const n0 = api.length;
  await trig().click(); await sleep(900); await gotoMonth(y, m);
  const day = popup().locator('.q-date__calendar-item--in button').filter({ hasText: new RegExp(`^${d}$`) }).first(); await day.click(); await sleep(400); await day.click(); await sleep(400);
  const picker = { header: await popup().locator('.selected-range').innerText().catch(() => null), range: await popup().locator('[data-test-id$="_range_indicator"]').innerText().catch(() => null) };
  await popup().getByRole('button', { name: 'Apply' }).click(); await sleep(6000);
  const tile = { chip: (await trig().innerText()).replace(/\n/g, ' '), value: await page.locator('[data-test-id="hero_value_revenueKpi"]').innerText(), supporting_line: await page.locator('[data-test-id="hero_meta_revenueKpi"]').innerText(),
    meta_box: await box(page.locator('[data-test-id="hero_meta_revenueKpi"]')), tile_box: await box(page.locator('[data-test-id="hero_tile_revenueKpi"]')) };
  const pics = []; for (const t of tickets) pics.push(await shot(page, t, `revenue-tile-lethbridge-${tag}`, { clip: { x: 0, y: 0, width: 1600, height: 520 } }));
  const server = api.slice(n0).map(a => ({ url: a.url, revenueKpi: a.body?.data?.revenueKpi, invoicesKpi: a.body?.data?.invoicesKpi }));
  // the tile's report link → Sales report for the same day (the ticket's "Data (Sales report)")
  const link = page.locator('[data-test-id="link_report_revenueKpi"]').first();
  const [p2] = await Promise.all([page.context().waitForEvent('page', { timeout: 8000 }).catch(() => null), link.click()]);
  const t = p2 || page; await t.waitForLoadState('domcontentloaded').catch(() => {}); await sleep(12000);
  const rows = (await t.locator('tbody tr').allInnerTexts().catch(() => [])).map(x => x.replace(/\s+/g, ' ')).slice(0, 15);
  const heads = (await t.locator('thead th').allInnerTexts().catch(() => [])).map(x => x.replace(/\s+/g, ' ').trim());
  const salesPic = await shot(t, 'SV-11823', `sales-report-lethbridge-${tag}`, { fullPage: true });
  R[tag] = { picker, tile, server, sales_report: { url: t.url().replace(APP, ''), heads, rows }, pictures: [...pics, salesPic] };
  console.log(tag, JSON.stringify({ picker, value: tile.value, line: tile.supporting_line, srv: server.map(s => [s.revenueKpi, s.invoicesKpi]), rows: rows.length }));
  if (p2) await p2.close();
}
await goDash(); const r99 = await finish(page, loc, rule99);
const seed = JSON.parse(fs.readFileSync('/tmp/cln/qa11839/seed.json', 'utf8')).CM;
const base = { app_version, location: loc.name, rule99: r99, observed_at_utc: new Date().toISOString(), seeded: { customer: seed.name, work_order: seed.display, invoice_id: seed.invoice, credit_memo: seed.memo } };
save('SV-11821/lethbridge', { ticket: 'SV-11821', ...base, days: { '2026-11-04': R['2026-11-04'] } });
save('SV-11823', { ticket: 'SV-11823', ...base, days: R });
console.log('RULE99', r99.all_match, app_version); await browser.close();
