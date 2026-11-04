// hd_extra.mjs — on-screen checks at Staging Heavy Duty - 9919 (TZ=America/Edmonton). SECRET-FREE. Phases: sv11820 | sv11934report | sv11691
import fs from 'fs';
import { boot, finish, shot, save, sleep, LOC, APP, OUT } from './common.mjs';
const loc = LOC.HD; const phase = process.argv[2]; const S = JSON.parse(fs.readFileSync('/tmp/cln/qa11839/seed.json', 'utf8'));
const { browser, page, rule99, app_version } = await boot(loc);
const txt = async l => (await l.first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim();
const box = async l => { const b = await l.first().boundingBox().catch(() => null); return b && { x: Math.round(b.x * 2), y: Math.round(b.y * 2), w: Math.round(b.width * 2), h: Math.round(b.height * 2) }; };
const goDash = async () => { await page.goto(APP + '/dashboard', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForSelector('[data-test-id="hero_value_revenueKpi"]', { timeout: 90000 }); await sleep(6000); };
const followLink = async k => { const link = page.locator(`[data-test-id="link_report_${k}"]`).first();
  const [p2] = await Promise.all([page.context().waitForEvent('page', { timeout: 8000 }).catch(() => null), link.click()]); const t = p2 || page; await t.waitForLoadState('domcontentloaded').catch(() => {}); await sleep(12000); return [t, p2]; };
const tableOf = async t => ({ heads: (await t.locator('thead th').allInnerTexts().catch(() => [])).map(x => x.replace(/\s+/g, ' ').replace(/arrow_drop_(up|down)/g, '').trim()),
  rows: (await t.locator('tbody tr').allInnerTexts().catch(() => [])).map(x => x.replace(/\s+/g, ' ').trim()).filter(Boolean) });
const P = { app_version, location: loc.name, rule99_start: rule99, started_utc: new Date().toISOString() }; let T;
if (phase === 'sv11820') {
  T = 'SV-11820';
  await goDash();   // step 3 first (tile defaults to This Month), then its report link (step 2), then Sales via the Revenue tile (step 1)
  P.dashboard_tile = { chip: await txt(page.locator('[data-test-id="date-range-selector_hero_range_billingEfficiencyKpi_trigger"]')), value: await txt(page.locator('[data-test-id="hero_value_billingEfficiencyKpi"]')), meta: await txt(page.locator('[data-test-id="hero_meta_billingEfficiencyKpi"]')), box: await box(page.locator('[data-test-id="hero_tile_billingEfficiencyKpi"]')) };
  await page.locator('[data-test-id="btn_toggle_details_billingEfficiencyKpi"]').click(); await sleep(7000);
  const panel = page.locator('[data-test-id="hero_detail_panel"]').first(); await panel.locator('tbody').first().scrollIntoViewIfNeeded().catch(() => {});
  P.dashboard_by_advisor = await tableOf(panel); P.pic_dash = await shot(page, T, '3-dashboard-billing-efficiency-this-month');
  await page.locator('[data-test-id="btn_toggle_details_billingEfficiencyKpi"]').click(); await sleep(1500);
  let [t, p2] = await followLink('billingEfficiencyKpi');
  P.saa = { url: t.url().replace(APP, ''), chip: (await t.locator('main').innerText()).split('\n').filter(l => /Date/.test(l)).slice(0, 2), ...(await tableOf(t)) };
  P.saa.unknown_rows = P.saa.rows.filter(r => /Unknown \(Inactive\)/.test(r)); P.saa.totals = P.saa.rows.filter(r => /^Totals?/i.test(r));
  P.pic_saa = await shot(t, T, '2-service-advisor-analysis-this-month', { fullPage: true }); if (p2) await p2.close();
  await goDash(); [t, p2] = await followLink('revenueKpi');
  P.sales = { url: t.url().replace(APP, ''), chip: (await t.locator('main').innerText()).split('\n').filter(l => /Date/.test(l)).slice(0, 2), ...(await tableOf(t)) };
  P.sales.totals = P.sales.rows.filter(r => /^Totals?/i.test(r)); P.sales.seeded_row = P.sales.rows.filter(r => r.includes(S.ADV3.display || 'S11839-17594'));
  P.pic_sales = await shot(t, T, '1-sales-report-this-month', { fullPage: true }); if (p2) await p2.close();
  await page.goto(`${APP}/workorders/${S.ADV3.wo}/lines`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(9000);
  P.wo_header = (await txt(page.locator('main'))).slice(0, 700); P.wo_advisor_text = (await page.locator('main').innerText()).split('\n').filter(l => /Unknown|Inactive|advisor/i.test(l)).slice(0, 6);
  P.pic_wo = await shot(page, T, '4-work-order-advisor-unknown-inactive');
  console.log(JSON.stringify({ tile: P.dashboard_tile, adv: P.dashboard_by_advisor.rows, saa_tot: P.saa.totals, saa_unknown: P.saa.unknown_rows, sales_tot: P.sales.totals, sales_row: P.sales.seeded_row, wo: P.wo_advisor_text, chips: [P.saa.chip, P.sales.chip] }).slice(0, 3000));
}
if (phase === 'sv11934report') {
  T = 'SV-11934';
  await goDash(); const k = 'salesByCustomer';
  await page.locator(`[data-test-id="date-range-selector_hero_range_${k}_trigger"]`).click(); await sleep(900);
  const pop = page.locator('.date-range-popup').last();
  for (let i = 0; i < 30; i++) { const tt = await pop.locator('.q-date__navigation').innerText(); if (/November/.test(tt) && /2026/.test(tt)) break; await pop.locator('.q-date__navigation .q-date__arrow button').nth(1).click(); await sleep(250); }
  const d = pop.locator('.q-date__calendar-item--in button').filter({ hasText: /^4$/ }).first(); await d.click(); await sleep(300); await d.click(); await sleep(300);
  await pop.getByRole('button', { name: 'Apply' }).click(); await sleep(6000);
  const [t, p2] = await followLink(k);
  P.report = { url: t.url().replace(APP, ''), chip: (await t.locator('main').innerText()).split('\n').filter(l => /Date/.test(l)).slice(0, 2), ...(await tableOf(t)) };
  P.report.row = P.report.rows.filter(r => r.includes(S.SBC.name)); P.pic_report = await shot(t, T, '7-sales-by-customer-report-today-after', { fullPage: true }); if (p2) await p2.close();
  console.log(JSON.stringify({ chip: P.report.chip, heads: P.report.heads, row: P.report.row }));
}
if (phase === 'sv11691') {
  T = 'SV-11691'; const CUS = '15c0778c-52b0-454a-b2f1-ddc518c10e5c';
  await page.goto(`${APP}/customers/${CUS}`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(9000);
  P.customer_url = page.url().replace(APP, ''); P.tabs = (await page.locator('.q-tab').allInnerTexts().catch(() => [])).map(x => x.replace(/\s+/g, ' ').trim());
  P.header = (await page.locator('main').innerText()).split('\n').filter(l => /Balance|\$/.test(l)).slice(0, 12);
  await page.locator('.q-tab').filter({ hasText: /^Invoices/ }).first().click(); await sleep(7000);
  const toggle = page.locator('.q-toggle').filter({ hasText: /Open only/i }).first();
  P.open_only_initial = await toggle.getAttribute('aria-checked').catch(() => null);
  if (P.open_only_initial !== 'true') { await toggle.click().catch(() => {}); await sleep(5000); }
  P.open_only_on = await tableOf(page); P.open_only_on.target = P.open_only_on.rows.filter(r => r.includes('S2-8650'));
  P.pic_open_on = await shot(page, T, '1-customer-invoices-open-only-on', { fullPage: true });
  await toggle.click().catch(() => {}); await sleep(5000); P.open_only_after_click = await toggle.getAttribute('aria-checked').catch(() => null);
  P.open_only_off = await tableOf(page); P.open_only_off.target = P.open_only_off.rows.filter(r => r.includes('S2-8650'));
  const row = page.locator('tbody tr').filter({ hasText: 'S2-8650' }).first(); await row.scrollIntoViewIfNeeded().catch(() => {}); await row.hover().catch(() => {}); await sleep(1000);
  P.row_tooltip = await page.locator('.q-tooltip').allInnerTexts().catch(() => []); P.row_checkbox_disabled = await row.locator('.q-checkbox').first().getAttribute('aria-disabled').catch(() => null);
  P.row_box = await box(row); P.pic_open_off = await shot(page, T, '2-customer-invoices-open-only-off-S2-8650');
  P.balance_lines = (await page.locator('main').innerText()).split('\n').filter(l => /Balance/i.test(l)).slice(0, 6);
  P.balance_text = await page.evaluate(() => { const el = [...document.querySelectorAll('main *')].find(e => e.children.length === 0 && /^Balance/i.test(e.textContent.trim())); if (!el) return null; const p = el.closest('div'); return p ? p.parentElement.innerText.replace(/\s+/g, ' ').slice(0, 120) : null; });
  await page.locator('.q-tab').filter({ hasText: /^Payments/ }).first().click().catch(() => {}); await sleep(6000);
  P.payments = await tableOf(page); P.payments.target = P.payments.rows.filter(r => r.includes('S2-8650')); P.pic_payments = await shot(page, T, '3-customer-payments', { fullPage: true });
  await page.goto(`${APP}/reports/ar-aging-detail`, { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(12000);
  P.ar_url = page.url().replace(APP, ''); const search = page.locator('[data-test-id="input_report_search"] input, input[data-test-id="input_report_search"]').first();
  if (await search.count()) { await search.fill('Wellington'); await sleep(6000); }
  P.ar = await tableOf(page); P.ar.wellington = P.ar.rows.filter(r => /Wellington|S2-8650/.test(r)).slice(0, 12);
  P.ar.text = (await page.locator('main').innerText()).split('\n').filter(l => /Wellington|S2-8650|Total|91/.test(l)).slice(0, 20);
  P.pic_ar = await shot(page, T, '4-ar-aging-detail-wellington', { fullPage: true });
  console.log(JSON.stringify({ tabs: P.tabs, open_initial: P.open_only_initial, on: P.open_only_on.target, off: P.open_only_off.target, heads: P.open_only_off.heads, tip: P.row_tooltip, cb: P.row_checkbox_disabled, bal: P.balance_lines, balt: P.balance_text, pay: P.payments.target, payn: P.payments.rows.length, ar: P.ar.wellington, art: P.ar.text, ar_url: P.ar_url }).slice(0, 4000));
}
P.rule99_end = await finish(page, loc, rule99); P.ended_utc = new Date().toISOString();
const f = `${OUT}/${T}/evidence${phase === 'sv11934report' ? '-report' : ''}.json`; fs.mkdirSync(`${OUT}/${T}`, { recursive: true }); fs.writeFileSync(f, JSON.stringify({ ticket: T, phase, ...P }, null, 1));
console.log('RULE99', P.rule99_end.all_match); await browser.close();
