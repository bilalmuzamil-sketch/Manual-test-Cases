// F3 Sales By Representative (C6, SV-11952): same-day order inside an opened rep / Unassigned, under several filter sets.
// Usage: TZ=America/Toronto node screen_sbr.mjs '<runs json>'  run = {name, preset?, unassigned?, expand: 'unassigned'|'all', shot?}
import fs from 'fs';
import { f3boot, assertLoc } from './f3boot.mjs';
const APP = 'https://app.staging.shopview.com'; const WP = '39522bc6-abca-4f67-bd12-2840043c2d68', TZ = 'America/Toronto', LNAME = 'DVI Test', L3 = 'dvi';
const runs = JSON.parse(process.argv[2]);
const OUT = `/home/user/Manual-test-Cases/build/dashboard-verify-2026-10-28/tickets-2026-10-29/filter-recheck/evidence/f3/SV-11952`; fs.mkdirSync(OUT, { recursive: true });
const { browser, page } = await f3boot(L3); // sets localStorage location + timezone (F4 trap, Rule 99)
let reqs = []; page.on('request', r => { const u = decodeURIComponent(r.url()); if (u.includes('sales-by-representative')) reqs.push(u.replace(/^.*?\/api/, '/api').slice(0, 500)); });
const meta = { ticket: 'SV-11952', location: 'DVI Test', location_tz: TZ, process_TZ: process.env.TZ || null, process_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, observed_at_utc: new Date().toISOString(), runs: {} };
meta.browser_zone = await page.evaluate(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
meta.app_timezone_key = await page.evaluate(() => localStorage.getItem('timezone'));
const num = s => { const m = s.match(/\b([PS])\d*-(\d+)\b/); return m ? [Number(m[2]), m[1]] : null; };
for (const run of runs) {
  reqs = []; const R = { spec: run };
  await page.goto(APP + '/reports/sales-by-representative', { waitUntil: 'domcontentloaded', timeout: 90000 }); await page.waitForTimeout(10000);
  R.loc_start = await assertLoc(page, LNAME, WP);
  meta.appVersion = meta.appVersion || await page.locator('meta[name="app-version"]').getAttribute('content').catch(() => null);
  if (run.preset) { await page.locator('[data-test-id="filter_chip_dateRange"]').click(); await page.waitForTimeout(1500);
    R.preset_ids = await page.locator('.q-menu [data-test-id]').evaluateAll(es => es.map(e => e.getAttribute('data-test-id')));
    await page.locator('.q-menu').last().getByText(run.preset, { exact: true }).first().click(); await page.waitForTimeout(1000); await page.keyboard.press('Escape').catch(() => {}); await page.waitForTimeout(8000); }
  if (run.unassigned) { await page.locator('[data-test-id="filter_chip_showUnassigned"]').click(); await page.waitForTimeout(6000); }
  if (run.expand === 'unassigned') { await page.locator('[data-test-id="button_sbr_expand_rep_00000000-0000-0000-0000-000000000000"]').click(); await page.waitForTimeout(9000); }
  if (run.expand && run.expand.startsWith('rep:')) { await page.locator(`[data-test-id="button_sbr_expand_rep_${run.expand.slice(4)}"]`).click(); await page.waitForTimeout(9000); }
  if (run.shotDay) { await page.locator('tr').filter({ hasText: run.shotDay }).first().evaluate(el => el.scrollIntoView({ block: 'center' })).catch(() => {}); await page.waitForTimeout(1200); }
  if (run.expand === 'all') { await page.locator('[data-test-id="button_sbr_expand_all"]').click(); await page.waitForTimeout(20000); }
  R.chips = await page.locator('[data-test-id^="filter_chip_"]').evaluateAll(es => es.map(e => e.innerText.replace(/\s+/g, ' ').trim()).filter(x => x !== 'cancel'));
  R.url = page.url();
  R.table = await page.locator('[data-test-id="table_sales_by_representative"] tbody tr').evaluateAll(trs => { let rep = null; const out = [];
    for (const t of trs) { const tx = t.innerText.replace(/\s+/g, ' ').trim(); if (t.querySelector('[data-test-id^="button_sbr_expand_rep_"]')) { rep = tx.slice(0, 40); continue; }
      if (t.querySelector('[data-test-id^="link_sbr_invoice_"], [data-test-id^="text_sbr_invoice_"]')) out.push({ rep, tx: tx.slice(0, 90) }); }
    return out; });
  // same-day order check inside each rep
  const groups = {}; for (const r of R.table) { const d = (r.tx.match(/^[A-Z][a-z]{2} \d{1,2} \d{4}/) || [''])[0]; const k = r.rep + ' | ' + d; (groups[k] = groups[k] || []).push(r.tx.match(/\b[PS]\d*-\d+\b/)?.[0]); }
  R.same_day = {}; let bad = 0, multi = 0;
  for (const [k, list] of Object.entries(groups)) { if (list.length < 2) continue; multi++; const ns = list.map(x => num(x || '') || [0, '']);
    const ok = ns.every((v, i) => i === 0 || v[0] > ns[i - 1][0] || (v[0] === ns[i - 1][0] && v[1] >= ns[i - 1][1])); if (!ok) bad++; R.same_day[k] = { ok, list }; }
  R.summary = { invoice_rows: R.table.length, multi_invoice_days: multi, days_out_of_number_order: bad };
  if (run.shot) { const day = run.shotDay; const rb = await page.locator('tr').filter({ hasText: day }).evaluateAll(trs => trs.map(t => { const b = t.getBoundingClientRect(); return [t.innerText.replace(/\s+/g, ' ').slice(0, 40), Math.round(b.x * 2), Math.round(b.y * 2), Math.round(b.width * 2), Math.round(b.height * 2)]; }));
    R.rowboxes = rb; R.chipboxes = await page.locator('[data-test-id^="filter_chip_"]').evaluateAll(es => es.map(e => { const b = e.getBoundingClientRect(); return [e.getAttribute('data-test-id'), Math.round(b.x * 2), Math.round(b.y * 2), Math.round(b.width * 2), Math.round(b.height * 2)]; }));
    await page.screenshot({ path: `${OUT}/${run.name}.png` }); }
  R.loc_end = await assertLoc(page, LNAME, WP); R.VALID = R.loc_start.ok && R.loc_end.ok;
  R.reqs = reqs; meta.runs[run.name] = R; fs.writeFileSync(`${OUT}/screen-meta-${process.env.SBR_TAG || 'main'}.json`, JSON.stringify(meta, null, 1));
  console.log(run.name, 'VALID=' + R.VALID, JSON.stringify({ chips: R.chips, summary: R.summary, bad: Object.entries(R.same_day).filter(([k, v]) => !v.ok).slice(0, 6).map(([k, v]) => k + ': ' + v.list.join(',')) }).slice(0, 1800));
}
console.log(JSON.stringify({ v: meta.appVersion, bz: meta.browser_zone, pz: meta.process_zone, tz: meta.location_tz, key: meta.app_timezone_key }));
await browser.close();
